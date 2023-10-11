const mongoose = require('mongoose')

const orderModel = mongoose.Schema({
    date: {
        orderDate: {
            type: Date,
            required: false
        },
        deliveryDate: {
            type: Date,
            required: false
        }
    },
    status: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        addressTitle: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    contactInformations: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        telephone: {
            type: String,
            required: true
        }
    },
    cardInformations: {
        cardNumber: {
            type: String,
            required: true
        },
        expirationDate: {
            type: String,
            required: true
        },
        cvv: {
            type: String,
            required: true
        },
        nameOnCard: {
            type: String,
            required: true
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true
    },
    lastCartPrice: {
        type: Number,
        required: true
    },
    cart: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Order', orderModel)