const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product:{
            item_name:{
                type: String,
                required: true,
            },
            item_code:{
                type: String,
                required: true,
            },
            image:{
                type: [String],
                required: true,
            },
            price:{
                type: Number,
                required: true,
            },
            brand:{
                type: String,
                required: true,
            },
            item_group:{
                type: String,
                required: true,
            },
            variant_of: {
                type: String,
                required: false,
            },
            color: {
                type: String,
                required: false,
            },
            ram:{
                type: Number,
                required: false,
            },
            rom:{
                type: Number,
                required: false,
            }
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    totalQuantity: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;