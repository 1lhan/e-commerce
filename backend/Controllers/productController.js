const express = require('express')
const router = express.Router()
const productModel = require('../Models/productModel')

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
        if (i == splitedFilters.length - 1) queryString['category'] = splitedFilters[i][1]
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

router.post('/get-product-names', async (req, res) => {
    const { products } = req.body
    let _products = []
    for (let i in products) {
        const product = await productModel.findOne({ _id: products[i].productId })
        if (product) _products.push({ productId: product._id, image: product.image, title: product.title })
    }
    return res.json({ action: true, products: _products })
})

module.exports = router