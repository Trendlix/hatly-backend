const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    item_code:{ 
        type: String, 
        required: false ,
    },
    name:{ 
        type: String, 
        required: true,
    },
    group:{ 
        type: String, 
        required: true, 
    },
    color:{
        type: String,
        required: false
    },
    storage:{
        type: Number,
        required: false
    },
    images:{ 
        type: [String],
        trim: true
    },
    description:{ 
        type: String, 
        required: true
    },
    brand:{ 
        type: String,
        required: false 
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    priceFrom:{
        type: Number,
        required: false
    },
    priceTo:{
        type: Number,
        required: false
    },
    ram:{ 
        type: Number,
        required: false
    },
    inStockQuantity:{ 
        type: Number, 
        required: true,
        default: 0
    },
    inStock:{
        type: Boolean,
        required: true,
        default: true
    },
    isForSale:{ 
        type: Boolean, 
        required: true,
        default: true
    },
    has_variants:{
         type: Boolean,
         required: true,
         default: false
    },
    variant_of: {
        type: String,
        required: false
    },
    stockQty:{
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true}

);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
