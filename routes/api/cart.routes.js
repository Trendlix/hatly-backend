const express = require('express');
const { authUser } = require('../../middleware/userAuth');
const  cartController  = require('../../controllers/cart.controller');
const routes = express.Router()

routes.post('/add', cartController.addToCart);
routes.post('/sync', cartController.syncCart);
routes.get('/:userId', cartController.getCart);
routes.put('/edit', cartController.updateCart)
routes.post('/checkout', cartController.checkoutCart)
routes.delete('/:item_code', cartController.deleteCartItem)

module.exports = routes;