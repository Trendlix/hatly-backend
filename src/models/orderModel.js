const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
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
       }, 
       extraDescription: {
        type: String, 
        required: false,
        default: ''
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
        default: 'Cash on Delivery',
        enum: ['Cash on Delivery', 'Online Payment']
    },
    paymentStatus: {
        type: String,
        default: 'not-paid',
        enum: ['not-paid', 'paid']
    },
    TransactionId: {
        type: String,
    },
    deliveryFees: {
        type:Number,
        required: true,
        default: 0,
    },
    subTotal: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;