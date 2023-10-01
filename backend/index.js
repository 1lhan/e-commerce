const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.listen(5000, () => {
    console.log('server running')
})

const productController = require('./Controllers/productController')
const authController = require('./Controllers/authController')
const userController = require('./Controllers/userController')

app.use(productController)
app.use(authController)
app.use(userController)

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log(err))