const express = require('express')
const router = express.Router()
const productModel = require('../Models/productModel')
const orderModel = require('../Models/orderModel')
const userModel = require('../Models/userModel')

router.post('/add-product', async (req, res) => {
    const { title, price, productFeatures, stock, category } = req.body
    const _product = new productModel(
        {
            title, image: '', date: new Date(),
            price: price.includes(',') ? Number(price.replace(',', '.')) : price,
            stock, saleAmount: 0, productInformations: '',
            category, features: productFeatures,
            reviews: { averageStar: 0, reviewsArray: [] }
        })

    _product.save()
        .then(() => { return res.json({ action: true, msg: 'Product added' }) })
        .catch(err => { return res.json({ action: false, msg: err.message }) })
})

router.get('/get-products/:filters', async (req, res) => {
    let queryString = {}
    let splitedFilters = req.params.filters.split('&')

    for (let i in splitedFilters) {
        splitedFilters[i] = splitedFilters[i].split('=')
        if (splitedFilters[i][1].includes(',')) splitedFilters[i][1] = splitedFilters[i][1].split(',')
    }

    for (let i in splitedFilters) {
        if (splitedFilters[i][0] == 'category') {
            if (splitedFilters[i][1] == 'null') { }
            else queryString['category'] = splitedFilters[i][1]
        }
        else {
            queryString['features.' + splitedFilters[i][0]] =
                typeof (splitedFilters[i][1]) == 'object' ? { $in: splitedFilters[i][1] } : splitedFilters[i][1]
        }
    }

    let products = await productModel.find(queryString)
    return res.json(products)
})

router.get('/get-product/:productName', async (req, res) => {
    const product = await productModel.findOne({ title: req.params.productName })
    if (product) return res.json({ action: true, product })
    else return res.json({ action: false, msg: 'Product could not find' })
})

router.post('/get-product-infos-by-id', async (req, res) => {
    const { products } = req.body

    let _products = []
    for (let i in products) {
        const product = await productModel.findOne({ _id: products[i].productId })
        if (product) _products.push({ productId: product._id, image: product.image, title: product.title, price: product.price })
    }
    return res.json({ action: true, products: _products })
})

router.post('/confirm-cart', async (req, res) => {
    const { cart } = req.body
    let result = []
    for (let i in cart) {
        let product = await productModel.findOne({ _id: cart[i].productId })
        if (product.stock == 0) {
            cart.splice(i, 1)
            result.push({ msg: "' " + product.title + " '" + ' product is out of stock' })
        }
        else if (cart[i].quantity > product.stock) result.push({ msg: "' " + product.title + " '" + ' product has ' + product.stock + ' in stock' })
        else if (cart[i].price != product.price) {
            cart[i].price = product.price
            result.push({ msg: "' " + product.title + " '" + ' product price updated' })
        }
    }
    return res.json({ action: true, cart, result })
})

router.post('/complate-shopping', async (req, res) => {
    const { userId, deliveryAddress, contactInformations, cardInformations, totalPrice, shippingCost, lastCartPrice, cart } = req.body

    // sepetteki ürünlerin stokları kontrol ediliyor
    let result = []
    for (let i in cart) {
        let product = await productModel.findOne({ _id: cart[i].productId })
        if (product.stock == 0) {
            cart.splice(i, 1)
            result.push({ msg: "' " + product.title + " '" + ' product is out of stock' })
        }
        else if (cart[i].quantity > product.stock) result.push({ msg: "' " + product.title + " '" + ' product has ' + product.stock + ' in stock' })
        else if (cart[i].price != product.price) {
            cart[i].price = product.price
            result.push({ msg: "' " + product.title + " '" + ' product price updated' })
        }
    }

    if (result.length == 0) {
        // sipariş tamamlandıktan sonra ürünlerin stokları azaltılıp satış sayıları arttırılıyor
        for (let i in cart) {
            await productModel.findOneAndUpdate({ _id: cart[i].productId }, { $inc: { saleAmount: Number(cart[i].quantity), stock: -Number(cart[i].quantity) } })
        }

        // yeni order objesi db'ye kaydediliyor
        let order = new orderModel({
            date: { orderDate: new Date(), deliveryDate: null }, status: 1, deliveryAddress: { addressTitle: deliveryAddress.addressTitle, address: deliveryAddress.address },
            contactInformations, cardInformations, totalPrice, shippingCost, lastCartPrice, cart
        })
        let _order = await order.save()

        if (_order) {
            // user objesine order'ın id'si pushlanıyor
            let saveOrderToUserObj = await userModel.findOneAndUpdate({ _id: userId }, { $push: { orders: { orderId: _order._id } } })
            if (saveOrderToUserObj) return res.json({ action: true })
        }
    }
    else return res.json({ action: false, result })
})

module.exports = router