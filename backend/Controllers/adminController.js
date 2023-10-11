const express = require('express');
const router = express.Router();
const orderModel = require('../Models/orderModel')
const productModel = require('../Models/productModel')
const userModel = require('../Models/userModel')

router.get('/get-orders', async (req, res) => {
    let orders = await orderModel.find()
    return res.json(orders)
})

router.get('/get-order/:orderId', async (req, res) => {
    let order = await orderModel.findOne({ _id: req.params.orderId })
    if (order) return res.json({ action: true, order })
    else return res.json({ action: false })
})

router.post('/update-order-status', async (req, res) => {
    const { orderId, status } = req.body;

    let update = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { 'date.deliveryDate': new Date(), status } })
    if (update) return res.json({ action: true })
})

router.post('/delete-product', async (req, res) => {
    const { productId } = req.body
    let _delete = await productModel.deleteOne({ _id: productId }, { new: true })
    if (_delete) return res.json({ action: true })
    else return res.json({ action: false })
})

router.get('/get-product-by-id/:productId', async (req, res) => {
    const { productId } = req.params
    let product = await productModel.findOne({ _id: productId })
    if (product) return res.json({ action: true, product })
})

router.post('/update-product', async (req, res) => {
    const { productId, title, price, stock, productFeatures, category: choosedCategory } = req.body;
    let product = await productModel.findOneAndUpdate({ _id: productId }, { $set: { title, price, stock, features: productFeatures, category: choosedCategory } })
    if (product) return res.json({ action: true })
    else return res.json({ action: false })
})

router.get('/get-user/:userId', async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.userId })
    if (user) return res.json({ action: true, user })
    else return res.json({ action: false })
})

module.exports = router