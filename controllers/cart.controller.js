const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { sendOrderMail } = require('../utils/sendOrderMail');
const sendSMS = require('../utils/sendSMS');


if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  let { PythonShell } = require("python-shell");
  let editStock = new PythonShell("./python/editStock.py");
  
  const { FrappeApp } = require("frappe-js-sdk");
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const SITE_URL = process.env.FRAPPE_SITE_URL;
  const API_SECRET = process.env.FRAPPE_SECERET;
  const API_KEY = process.env.FRAPPE_API_KEY;
  const API_USER = process.env.FRAPPE_USR;
  const API_PWD = process.env.FRAPPE_PWD;
  const credintials = { usr: API_USER, pwd: API_PWD, url: SITE_URL };
  
  const connectToDB = () => {
    // connecting to erpNext
    const frappe = new FrappeApp(SITE_URL, {
      useToken: true,
      token: () => `${API_KEY}:${API_SECRET}`,
      type: "token",
    });
    const db = frappe.db();
    console.log("connected");
    return db;
  };
  
  function getAttributeValue(attributes, key) {
    const attribute = attributes.find(attr => attr.hasOwnProperty(key));
    return attribute ? attribute[key] : null;
}

const syncCart = async(req, res) => {
    try {
        const user = req.user;
        const localCart = req.body
        console.log('req.body.products', req.body.products)
        console.log('localCart', localCart)
        console.log(localCart.products)
        let cart = await Cart.findOne({userId: user._id})
        if(!cart) {
            cart = new Cart({
                userId: user._id, 
                products: localCart.products.map((item)=> {
                    return {
                        product:{
                            item_code: item.product.item_code, 
                            image: item.product.image,  
                            item_name: item.product.item_name, 
                            item_group: item.product.item_group,
                            price: item.product.price,
                            brand: item.product.brand,
                            variant_of: item.product.variant_of,
                            color: item.product.color,
                            rom: item.product.rom,
                            ram: item.product.ram
                        },
                        quantity: item.quantity, 
                    }
                }), 
                total: localCart.total, 
                totalQuantity: localCart.totalQuantity
            }) 
        } 
        // localCart.products.findIndex((cartItem)=>)
        // cart.products = [...cart.products, ...localCart.products.map((item)=> {return {productId: item._id, quantity: item.quantity}})]
        // cart.total = localCart.total
        // cart.totalQuantity = localCart.totalQuantity
        await cart.save()
        cart = await Cart.findOne({userId: user._id})
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const addToCart = async(req, res) => {
    try {
        const user = req.user;
        console.log('user in request', user)
        const {product, quantity} = req.body;
        console.log('product', product)
        let cart = await Cart.findOne({ userId: user._id })
        console.log('usercart', cart)
        if(!cart) {
            cart = new Cart({userId: user._id, products: [], total: 0, totalQuantity: 0}) 
        }
        // this checks if the product we are trying to add is already in the cart
        // findIndex return the index of the first product that meets the condition if not found returns -1
        const itemIndex = cart.products.findIndex(item => item.product.item_code === product.item_code)
        // const productAllData = await Product.findById(productId)

        
        if(product.stockQty >= quantity && product.is_sales_item && product.is_stock_item){
            if(itemIndex > -1) {
                const foundProduct = cart.products[itemIndex]
                foundProduct.quantity = quantity
                // this line here re-assign the product again after being updated with quantity
                cart.products[itemIndex] = {
                    product: {
                        item_code: product.item_code, 
                        image: product.image, 
                        item_name: product.item_name, 
                        item_group: product.item_group,
                        price: product.price,
                        brand: product.brand,
                        variant_of: product.variant_of,
                        color: getAttributeValue(product.attributes, 'Colour'),
                        rom: getAttributeValue(product.attributes, 'Rom'),
                        ram: getAttributeValue(product.attributes, 'Ram')
                    },
                    quantity: cart.products[itemIndex].quantity + quantity
                }
            }else {
                cart.products.push({
                    product: {
                        item_code: product.item_code, 
                        image: product.image, 
                        item_name: product.item_name, 
                        item_group: product.item_group,
                        price: product.price,
                        brand: product.brand,
                        variant_of: product.variant_of,
                        color: getAttributeValue(product.attributes, 'Colour'),
                        rom: getAttributeValue(product.attributes, 'Rom'),
                        ram: getAttributeValue(product.attributes, 'Ram')
                    },
                    quantity
                })
            }
            await cart.save()
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
            // const product = await Product.findById(cartItem.productId);
            // console.log(product)
            total += product.price * cartItem.quantity;
            totalQuantity += cartItem.quantity
            console.log('total of cart', total)
        }
        cart.total = total
        cart.totalQuantity = totalQuantity
        await cart.save()
        cart = await Cart.findOne({ userId: user._id });
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
        // const { itemId } = req.params
        const user = req.user
        const item_code = req.params.item_code
        let cart = await Cart.findOne({ userId: user._id })
        if(!cart){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        const itemIndex = cart.products.findIndex(item => item.product.item_code === item_code)
        if(itemIndex > -1){
            // const productAllData = await Product.findById(cart.products[itemIndex].productId)
            cart.total -= cart.products[itemIndex].quantity * cart.products[itemIndex].product.price
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
        cart = await Cart.findOne({ userId: user._id })
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
        const db = connectToDB();
        const user = req.user
        const { address, paymentMethod, TransactionId, deliveryFees } = req.body
        const cart = await Cart.findOne({ userId: user._id })
        console.log(cart)
        if(!cart){
            return res.status(404).json({
                ok: false,
                status: 404,
                message: 'Cart not found'
            })
        }
        for (const product of cart.products){
            const data = await db.getDocList("Item", {
                filters: { variant_of: product.product.variant_of },
                fields: [
                  "name", "item_name", "item_code", "item_group", "description", "brand", "is_stock_item", "is_sales_item", "image", "has_variants", "variant_of",
                ],
                limit: "4000",
              });
              let readStock = new PythonShell("./python/readStock.py");
              const priceList = await db.getDocList("Item Price", {
                fields: ["item_code", "price_list_rate"],
                limit: "4000",
              });
          
              // get the price
              data.forEach((i, index) => {
                priceList.forEach((_) => {
                  if (i.item_code == _.item_code) data[index].price = _.price_list_rate;
                });
              });
          
              let attributes = [];
              await Promise.all([
                ...data.map(_ => _.name).map(async i => {
                  const doc = await db.getDoc("Item", i);
                  if (doc.attributes && doc.attributes.length > 0) {
                    attributes[i] = doc.attributes.map((_) => ({
                      [_.attribute]: _.attribute_value
                    }));
                  }
                }),
                new Promise(resolve => {
                  readStock.send(JSON.stringify({ ...credintials, "code": data.map(_ => _.item_code) }));
                  readStock.on("message", function (message) {
                    const result = message.substring(1, message.length - 1).split(',');
                    data.forEach((list, index) => {
                      list.stockQty = result[index]
                    });
                    resolve();
                  });
                })
              ]);
          
              data.forEach((list, index) => {
                list.attributes = attributes[list.item_code];
              });
              
              console.log('data', data)
              const singleItem = data.find((item) => item.attributes.find((attr)=> attr["Colour"] === product.product.color))
              console.log('singleItem', singleItem)
              

              let editStock = new PythonShell("./python/editStock.py");

              await new Promise((resolve, reject) => {
                  editStock.send(
                      JSON.stringify({ ...credintials, newQty: !singleItem.stockQty?.includes("None") ? Number(singleItem.stockQty) - product.quantity : 0, code: product.product.item_code })
                  );
        
                  editStock.on("message", function (message) {
                      console.log(message);
                      resolve();
                  });
        
                  editStock.on("error", function (error) {
                      console.log('Error:', error);
                      reject(error);
                  });
        
                  editStock.on("close", function () {
                      console.log('Python script finished');
                      resolve();
                  });
              });
        
            //   let editStock = new PythonShell("./python/editStock.py");
            //   await new Promise(resolve=>{
            //     editStock.send(
            //       JSON.stringify({ ...credintials, newQty: !singleItem.stockQty?.includes("None") ? Number(singleItem.stockQty) - product.quantity : 0, code: product.product.item_code })
            //     );
            //     editStock.on("message", function (message) { 
            //       console.log(message);
            //       resolve();
            //     })
            //   })
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
            })
            await order.save()
            const ordersUrl = process.env.NODE_ENV === 'production' ? `https://hatlystore.trendlix.com/orders/${order._id}`: `http://localhost:3000/orders/${order._id}`
            // await sendSMS(user.phone, `Your order of id ${order._id} has been confirmed successfully check it from here ${ordersUrl}`);
            // await sendOrderMail(user, order)
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