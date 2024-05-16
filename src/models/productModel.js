const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    code:{ 
        type: String, 
        required: true ,
        unique: true
    },
    name:{ 
        type: String, 
        required: true,
        unique: true 
    },
    group:{ 
        type: String, 
        required: true, 
        enum:["phones", "chargers", "smart watches", "headphones", "accessories" ]
    },
    color:{
        type: String,
        required: true
    },
    storage:{
        type: Number,
        required: true
    },
    images:{ 
        type: [String]
    },
    description:{ 
        type: String, 
        required: true
    },
    brand:{ 
        type: String,
        required: true 
    },
    priceFrom:{
        type: Number,
        required: true
    },
    priceTo:{
        type: Number,
        required: true
    },
    ram:{ 
        type: Number,
        required: true
    },
    inStockQuantity:{ 
        type: Number, 
        required: true 
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
    }}, {timestamps: true}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
