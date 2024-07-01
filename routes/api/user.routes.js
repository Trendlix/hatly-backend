const {Router} =  require('express');
const userController  = require('../../controllers/user.controller');
const { authUser } = require('../../middleware/userAuth');

const routes = Router();

routes.route('/signup' ).post(userController.signup)
routes.route('/login' ).post(userController.login)
routes.route('/logout' ).get(userController.logout)
routes.route('/auth' ).post(userController.getUserInfo)
// routes.route('/auth' ).get(userController.auth)
routes.route('/forgotPassword' ).post(userController.forgotPassword)
routes.route('/resetPassword/:token' ).patch(userController.resetPassword)

routes.route('/').post(userController.addUser).patch(userController.updateUser);


module.exports = routes;