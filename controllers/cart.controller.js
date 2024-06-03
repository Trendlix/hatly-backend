const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { sendOrderMail } = require('../utils/sendOrderMail');
const sendSMS = require('../utils/sendSMS');


const syncCart = async(req, res) => {
    try {
        const user = req.user;
        const localCart = req.body
        console.log('localCart', localCart)
        console.log(localCart)
        let cart = await Cart.findOne({userId: user._id}).populate('products.productId')
        if(!cart) {
            cart = new Cart({userId: user._id, products: localCart.products.map((item)=> {return {productId: item._id, quantity: item.quantity}} ), total: localCart.total, totalQuantity: localCart.totalQuantity}) 
        } 
        // localCart.products.findIndex((cartItem)=>)
        // cart.products = [...cart.products, ...localCart.products.map((item)=> {return {productId: item._id, quantity: item.quantity}})]
        // cart.total = localCart.total
        // cart.totalQuantity = localCart.totalQuantity
        await cart.save()
        cart = await Cart.findOne({userId: user._id}).populate('products.productId')
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const addToCart = async(req, res) => {
    try {
        const user = req.user;
        console.log('user in request', user)
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: user._id }).populate('products.productId')
        console.log('usercart', cart)
        if(!cart) {
            cart = new Cart({userId: user._id, products: [], total: 0, totalQuantity: 0}) 
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
        let total = 0;
        let totalQuantity = 0;
        for (const cartItem of cart.products) {
            const product = await Product.findById(cartItem.productId);
            console.log(product)
            total += product.price * cartItem.quantity;
            totalQuantity += cartItem.quantity
            console.log('total of cart', total)
        }
        cart.total = total
        cart.totalQuantity = totalQuantity
        await cart.save()
        cart = await Cart.findOne({ userId: user._id }).populate('products.productId');
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
        const cart = await Cart.findOne({ userId: user._id }).populate('products.productId')
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
        let cart = await Cart.findOne({ userId: user._id })
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
            cart.total -= cart.products[itemIndex].quantity * productAllData.price
            cart.totalQuantity -= cart.products[itemIndex].quantity
            cart.products.splice(itemIndex, 1)
            await cart.save()
        }else{
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Product not found in cart'
            })
        }
        cart = await Cart.findOne({ userId: user._id }).populate('products.productId');
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
        const { address, paymentMethod, TransactionId, deliveryFees, extraDescription } = req.body
        const cart = await Cart.findOne({ userId: user._id }).populate('products.productId')
        console.log(cart)
        if(!cart){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        for (const product of cart.products){
            const productAllData = await Product.findById(product.productId._id)
            productAllData.inStockQuantity -= product.quantity
            await productAllData.save()
        }
        const order = new Order({
            userId: user._id,
            products: cart.products,
            address,
            paymentMethod: paymentMethod === 'Cash' ? 'Cash on Delivery': 'Online Payment',
            subTotal: cart.total,
            totalAmount: cart.total + deliveryFees,
            deliveryFees,
            TransactionId,
            extraDescription: extraDescription ? extraDescription : '',
        })
        await order.save()
        const ordersUrl = process.env.NODE_ENV === 'production' ? `https://hatlystore.trendlix.com/orders/${order._id}`: `http://localhost:3000/orders/${order._id}`
        // await sendSMS(user.phone, `Your order of id ${order._id} has been confirmed successfully check it from here ${ordersUrl}`);
        await sendOrderMail(user, order)
        cart.products = [];
        cart.total = 0;
        cart.totalQuantity = 0
        await cart.save()
        const originalUser = await User.findById(user._id)
        originalUser.city = address.city
        originalUser.country = address.country
        originalUser.floor = address.floor
        originalUser.apartment = address.apartment
        originalUser.building = address.building
        originalUser.street = address.street
        await originalUser.save()
        res.status(200).json({
            message: "your order is placed successfully, Thanks for using Hatly Stores!",
            order,
            ok: true
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



module.exports = { addToCart, getCart, updateCart, checkoutCart, deleteCartItem, syncCart}