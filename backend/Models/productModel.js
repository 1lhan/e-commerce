const mongoose = require('mongoose')

const productModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    saleAmount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productInformations: {
        type: String,
        required: false
    },
    features: {
        type: Object,
        required: true
    },
    reviews: {
        averageStar: {
            type: Number,
            required: false
        },
        reviewsArray: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: 'User'
                },
                date: {
                    type: Date,
                    required: true
                },
                star: {
                    type: String,
                    required: false
                },
                comment: {
                    type: String,
                    required: false
                }
            }
        ]
    }
})

module.exports = mongoose.model('Product', productModel)