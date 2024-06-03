const { Router } = require('express');
const orderController = require('../../controllers/order.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();


routes.route('/').get(authUser , orderController.getUserOrders);
routes.route('/:orderId').get(authUser , orderController.getOrder)
module.exports = routes
