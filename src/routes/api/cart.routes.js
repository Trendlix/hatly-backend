const express = require('express');
const { authUser } = require('../../middleware/userAuth');
const  cartController  = require('../../controllers/cart.controller');
const routes = express.Router()

routes.post('/add', authUser, cartController.addToCart);
routes.post('/sync', authUser, cartController.syncCart);
routes.get('/', authUser, cartController.getCart);
routes.put('/edit', authUser, cartController.updateCart)
routes.post('/checkout', authUser, cartController.checkoutCart)
routes.delete('/:itemId', authUser, cartController.deleteCartItem)

module.exports = routes;