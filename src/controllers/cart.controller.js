const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { sendOrderMail } = require('../utils/sendOrderMail');
const sendSMS = require('../utils/sendSMS');


const addToCart = async(req, res) => {
    try {
        const user = req.user;
        console.log('user in request', user)
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: user._id })
        console.log('usercart', cart)
        if(!cart) {
            cart = new Cart({userId: user._id, products: [], totalPrice: 0}) 
        }
        // this checks if the product we are trying to add is already in the cart
        // findIndex return the index of the first product that meets the condition if not found returns -1
        const itemIndex = cart.products.findIndex(product => product.productId.equals(productId))
        const productAllData = await Product.findById(productId)
        
        if(productAllData.inStockQuantity >= quantity && productAllData.isForSale && productAllData.inStock){
            if(itemIndex > -1) {
                const product = cart.products[itemIndex]
                product.quantity = quantity
                // this line here re-assign the product again after being updated with quantity
                cart.products[itemIndex] = product
            }else {
                cart.products.push({
                    productId,
                    quantity
                })
            }
        }else{
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'we are sorry but this quantity is out of stock'
            })
        }
        // const productData = await Cart.findById(productId)
        let totalPrice = 0;
        for (const cartItem of cart.products) {
            const product = await Product.findById(cartItem.productId);
            console.log(product)
            totalPrice += product.price * cartItem.quantity;
            console.log('totalPrice of cart', totalPrice)
        }
        cart.totalPrice = totalPrice
        await cart.save()
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message
        })   
    }
}

const getCart = async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ userId: user._id })
        console.log('you cart is ', cart)
        if(!cart){
            return res.status(404).json({
                ok: true,
                status: 404,
                message: 'you have not added any products in the cart'
            })
        }
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message
        })   
    }
}

const updateCart = async (req, res) => {
    try {
        const user = req.user
        const { productId, quantity } = req.body
        const cart = await Cart.findOne({ userId: user._id })
        if(!cart) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        const itemIndex = cart.products.findIndex(product => product.productId.equals(productId))
        if(itemIndex > -1 ){
            const product = cart.products[itemIndex]
            product.quantity += quantity
            cart.products[itemIndex] = product
        }else{
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Product not found in cart'
            })
        }
        await cart.save()
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message
        })
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const { itemId } = req.params
        const user = req.user
        const cart = await Cart.findOne({ userId: user._id })
        if(!cart){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        const itemIndex = cart.products.findIndex(product => product.productId.equals(itemId))
        if(itemIndex > -1){
            const productAllData = await Product.findById(cart.products[itemIndex].productId)
            cart.totalPrice -= cart.products[itemIndex].quantity * productAllData.price
            cart.products.splice(itemIndex, 1)
            await cart.save()
        }else{
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Product not found in cart'
            })
        }
        res.status(200).json(cart);      
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message
        })
    }
}

const checkoutCart = async (req, res) => {
    try {
        const user = req.user
        const { address, paymentMethod } = req.body
        const cart = await Cart.findOne({ userId: user._id }).populate('products.productId')
        if(!cart){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        for (const product of cart.products){
            const productAllData = await Product.findById(product.productId)
            productAllData.inStockQuantity -= product.quantity
            await productAllData.save()
        }
        const order = new Order({
            userId: user._id,
            products: cart.products,
            address,
            paymentMethod,
            totalAmount: cart.totalPrice
        })
        await order.save()
        const ordersUrl = process.env.NODE_ENV === 'production' ? `https://hatlystore.trendlix.com/orders/${order._id}`: `http://localhost:3000/orders/${order._id}`
        // await sendSMS(user.phone, `Your order of id ${order._id} has been confirmed successfully check it from here ${ordersUrl}`);
        await sendOrderMail(user, order)
        cart.products = [];
        cart.totalPrice = 0;
        await cart.save()
        
        res.status(200).json({
            message: "your order is placed successfully, Thanks for using Hatly Stores!",
            order,
            success: 'ok' 
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message
        })
    }
}



module.exports = { addToCart, getCart, updateCart, checkoutCart, deleteCartItem}