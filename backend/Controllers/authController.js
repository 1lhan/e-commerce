const express = require('express');
const router = express.Router();
const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/change-password', async (req, res) => {
    const { _id, currentPassword, newPassword } = req.body

    let user = await User.findOne({ _id })
    if (!user) return res.json({ action: false, msg: 'User could not find' })

    let currentPasswordControl = await bcrypt.compare(currentPassword, user.password)
    if (!currentPasswordControl) return res.json({ action: false, msg: 'Current password wrong' })

    let hashedPassword = await bcrypt.hash(newPassword, saltRounds)
    let changePassword = await User.findOneAndUpdate({ _id }, { $set: { password: hashedPassword } })
    if (changePassword) return res.json({ action: true })
    else return res.json({ action: false, msg: 'Change password action fail' })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    let user = await User.findOne({ email })

    if (user != null) {
        let passwordControl = await bcrypt.compare(password, user.password)

        if (passwordControl) {
            user.password = ''
            const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
            return res.json({ action: true, user, token: accessToken })
        }
    }
    return res.json({ action: false, msg: 'No user matching with this informations' })
})

router.post('/auto-login', (req, res) => {
    const token = req.body.token.slice(6, req.body.token.length)
    if (!token) return res.json({ bool: false })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            return res.json({ bool: false })
        }
        else {
            User.findById(data._id).then(user => {
                if (user) {
                    user.password = ''
                    return res.json({ bool: true, user })
                }
                else return res.json({ bool: false })
            })
        }
    })
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    let isEmailAvailable = await User.findOne({ email })
    if (isEmailAvailable != null) return res.json({ action: false, msg: 'The email has already been using' })

    let hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({
        firstName: firstName, lastName, email, password: hashedPassword, accountType: 'user',
        userInformations: { telephone: '', cards: [], birthDate: '', gender: '' }, addresses: [], cart: [], favorites: [], orders: [], reviews: []
    })

    let register = await user.save()
    if (register) return res.json({ action: true })
    else return res.json({ action: false, msg: 'Account could not create' })
})

module.exports = router