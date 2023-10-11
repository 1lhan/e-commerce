const express = require('express')
const router = express.Router()
const userModel = require('../Models/userModel')
const orderModel = require('../Models/orderModel')
const productModel = require('../Models/productModel')

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

router.get('/get-orders/:userId', async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.userId })

    if (user) {
        let orderIds = user.orders
        let orders = []
        for (let i in orderIds) {
            let order = await orderModel.findOne({ _id: orderIds[i].orderId })
            if (order) orders.push(order)
        }
        return res.json({ action: true, orders })
    }
})

router.post('/add-review', async (req, res) => {
    const { userId, productId, star, comment } = req.body;

    // kullanıcı mevcut mu değil mi kontrol edilir
    let user = await userModel.findOne({ _id: userId })
    if (!user) return res.json({ action: false, msg: 'User could not find' })

    // kullanıcının order geçmişinden ürünün daha önce sipariş edilip edilmediği kontrol edilir
    let orderHistory = user.orders
    let checkProductBool = false
    for (let i in orderHistory) {
        let order = await orderModel.findOne({ _id: orderHistory[i].orderId })
        if (!order) return res.json({ action: false, msg: 'Order could not find' })

        let checkProduct = order.cart.findIndex(product => product.productId == productId)
        if (checkProduct != -1) checkProductBool = true
    }

    if (!checkProductBool) return res.json({ action: false, msg: 'You have not ordered this product' })

    // eğer ürün sipariş edilmişse de o ürün hakkında inceleme yapılmış mı yapılmamış mı kontrol edilir
    let isReviewed = true
    if (user.reviews.findIndex(review => review.productId == productId) == -1) isReviewed = false
    else return res.json({ action: false, msg: 'You have already reviewed this product' })

    if (!isReviewed) {
        let date = new Date()

        let addReviewToUserObj = await userModel.findOneAndUpdate({ _id: userId }, { $push: { reviews: { productId, star, comment, date } } })
        if (addReviewToUserObj) {
            let productObj = await productModel.findOne({ _id: productId })
            productObj.reviews.reviewsArray.push({ userId, star, comment, date })
            let averageStar = 0
            if (productObj) {
                for (let i in productObj.reviews.reviewsArray) {
                    averageStar += Number(productObj.reviews.reviewsArray[i].star)
                }
                averageStar = averageStar / Number(productObj.reviews.reviewsArray.length)

                let addReviewToProductObj = await productModel.findOneAndUpdate({ _id: productId },
                    { $set: { 'reviews.averageStar': averageStar }, $push: { 'reviews.reviewsArray': { userId, star, comment, date } } })
                if (addReviewToProductObj) return res.json({ action: true })
            }
        }
        else return res.json({ action: false })
    }
})

module.exports = router;