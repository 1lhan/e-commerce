const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    userInformations: {
        telephone: {
            type: String,
            required: false
        },
        cards: [
            {
                cardNumber: {
                    type: Number,
                    required: false
                },
                nameOnCard: {
                    type: String,
                    required: false
                },
                expirationDate: {
                    type: String,
                    required: false
                },
                securityCode: {
                    type: Number,
                    required: false
                }
            }
        ],
        birthDate: {
            type: Date,
            required: false
        },
        gender: {
            type: String,
            required: false
        }
    },
    addresses: [
        {
            addressTitle: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        }
    ],
    cart: [
        {
            productId: {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        }
    ],
    favorites: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    reviews: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            date:{
                type:Date,
                required:true
            },
            comment: {
                type: String,
                required: true
            },
            star: {
                type: Number,
                required: true
            }
        }
    ],
    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Order'
            }
        }
    ]
})

module.exports = mongoose.model('User', userModel)