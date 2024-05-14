const {Router}  = require('express');

const userRoutes = require('./api/user.routes');
const orderRoutes = require('./api/order.routes');

const routes = Router();

routes.use('/users' , userRoutes);
routes.use('/orders' , orderRoutes);

module.exports = routes;