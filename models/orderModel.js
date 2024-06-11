const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
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
                type: String,
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