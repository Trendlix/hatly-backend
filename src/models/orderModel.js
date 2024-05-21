const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    address: {
       city: {
        type: String,
        default: '',
        trim: true,
        required: true
       },
       street: {
        type: String,
        default: '',
        trim: true,
        required: true
       },
       building: {
        type: Number,
        default: '',
        trim: true,
        required: true
       },
       apartment: {
        type: Number,
        default: '',
        trim: true,
        required: true
       },
       floor:{
        type: Number,
        default: '',
        trim: true,
        required: true
       }
    },
    orderStatus: { 
        type: String, 
        required: true, 
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Processing' 
    },
    paymentMethod: {
        type: String,
        default: 'cash on delivery',
        enum: ['cash on delivery', 'online']
    },
    paymentStatus: {
        type: String,
        default: 'not-paid',
        enum: ['not-paid', 'paid']
    }
}, {timestamps: true})


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;