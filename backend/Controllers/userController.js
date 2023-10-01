const express = require('express')
const router = express.Router()
const userModel = require('../Models/userModel')

router.post('/update-user-informations', async (req, res) => {
    const { userId, firstName, lastName, email, telephone, birthDate, gender } = req.body
    const updateObj = {
        firstName, lastName, email, 'userInformations.telephone': telephone,
        'userInformations.birthDate': birthDate, 'userInformations.gender': gender,
    }
    let _update = await userModel.findOneAndUpdate({ _id: userId }, updateObj, { new: true })
    _update.password = ''

    if (_update) return res.json({ action: true, user: _update })
    else return res.json({ action: false })
})

router.post('/address-actions', async (req, res) => {
    const { userId, reqData, action } = req.body

    let newUserObject;
    if (action == 'add-address') {
        newUserObject = await userModel.findOneAndUpdate({ _id: userId }, { $push: { addresses: { addressTitle: reqData.addressTitle, address: reqData.address } } }, { new: true })
    }
    else if (action == 'delete-address') {
        newUserObject = await userModel.findOneAndUpdate({ _id: userId }, { $pull: { addresses: { _id: reqData.addressId } } }, { new: true })
    }
    else if (action == 'update-address') {
        newUserObject = await userModel.findOneAndUpdate({ _id: userId, addresses: { $elemMatch: { _id: reqData.addressId } } },
            { $set: { 'addresses.$.addressTitle': reqData.addressTitle, 'addresses.$.address': reqData.address } }, { new: true })
    }

    newUserObject.password = ''
    if (newUserObject) return res.json({ action: true, user: newUserObject })
    else return res.json({ action: false })
})

router.post('/favorites', async (req, res) => {
    const { userId, productId } = req.body
    let _user = await userModel.findOne({ _id: userId })
    let user;

    if (_user.favorites.findIndex(favorite => favorite.productId == productId) == -1) user = await userModel.findOneAndUpdate({ _id: userId }, { $push: { favorites: { productId } } }, { new: true })
    else if (_user.favorites.length == 0) user = await userModel.findOneAndUpdate({ _id: userId }, { $push: { favorites: { productId } } }, { new: true })
    else user = await userModel.findOneAndUpdate({ _id: userId }, { $pull: { favorites: { productId } } }, { new: true })

    user.password = ''
    if (user) return res.json({ action: true, user })
    else return res.json({ action: false })
})

module.exports = router;