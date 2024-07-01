const { Router } = require('express');
const orderController = require('../../controllers/order.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();


routes.route('/:userId').get(orderController.getUserOrders);
routes.route('/:userId/:orderId').get(orderController.getOrder)
module.exports = routes
