const {Router}  = require('express');

const userRoutes = require('./api/user.routes');
const orderRoutes = require('./api/order.routes');
const cartRoutes = require('./api/cart.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/orders', orderRoutes);
routes.use('/cart', cartRoutes);

module.exports = routes;