const db = require("../database");
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const crypto = require("crypto");

const User = require('../models/userModel');
// const auth = require('../middleware/userAuth');
const ServerError = require('../utils/ErrorInterface');
const ApiFeatures = require('../utils/apiFeatures');
const sendToken = require("../utils/jwtToken");
const sendSMS = require("../utils/sendSMS");

const signup = async (req, res, next) => {
  try {
    // get user data from request
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    // check if user's data exist
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword)
      return next(ServerError.badRequest(400, 'enter all fields'));
    // check if password is correct
    if (password !== confirmPassword)
      return next(ServerError.badRequest(400, 'password not match'));
    // create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password
    });
    // save user in database
    await user.save().then(()=>{
      console.log('user saved')
      console.log(user)
      sendToken(user, 201, res);
    }).catch(err => {
      console.log(err)
      return next(ServerError.badRequest(400, err.message))
    })    
    //save user in ERP database
    // const sql = `INSERT INTO tabCustomer SET idx = ?,name = ?,customer_name = ?,email_id = ?,mobile_no = ?, customer_primary_contact = ? ,language = ?,territory = ? ,customer_group = ?,customer_type = ?,owner = ?,modified_by = ?;`
    // const [rows, fields] = await db.query(sql, [
    //   user.id,
    //   `${firstName} ${lastName}_${Date.now()}`,
    //   `${firstName} ${lastName}`,
    //   user.email,
    //   user.phone,
    //   user.phone,
    //   'en',
    //   'All Territories',
    //   'All Customer Groups',
    //   'Individual',
    //   'admin@hatlystore.com',
    //   'admin@hatlystore.com',
    // ])
    // send response to user;
   
    // res.status(201).json({
    //   ok: true,
    //   code: 201,
    //   message: 'succeeded',
    //   data: user,
    //   token
    // });
  } catch (e) {
    console.log(e)
    e.statusCode = 400
    next(e)
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log(email, password)
    // console.log(req.body)
    // console.log(email)
    // console.log(password)
    if (!email || !password)
      return next(ServerError.badRequest(400, 'email and password are required'));
    const user = await User.Login(email, password);
    // send response to user;
    sendToken(user, 200, res);
    // res.json({
    //   ok: true,
    //   code: 200,
    //   message: 'succeeded',
    //   body: user,
    //   token,
    // });
  } catch (e) {
    e.statusCode = 401;
    next(e);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = { ...req.user._doc };
    delete user.tokens
    delete user.password
    delete user.resetLink
    if (!user) {
      return next(ServerError.badRequest(401, "token is not valid"));
    }
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: user
    })
  } catch (e) {
    next(e);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const notAllowedUpdates = ['status', 'tokens', 'image', 'balance', 'password', 'updatedAt', '_id', 'createdAt', 'resetLink',];
    const inValidUpdates = updates.filter(el => notAllowedUpdates.includes(el))
    console.log(inValidUpdates)
    if (inValidUpdates.length > 0) {
      return next(ServerError.badRequest(401, `not allowed to update (${inValidUpdates.join(', ')})`))
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    })
    // const sql = `UPDATE tabCustomer SET customer_name = ?,email_id = ?,mobile_no = ?, customer_primary_contact = ? WHERE id = ?;`
    // const erpUser = await db.query(sql, [
    //   `${user.firstName} ${user.lastName}`,
    //   user.email,
    //   user.phone,
    //   user.phone,
    //   user.id,
    // ])
    await user.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: user,
    })
  } catch (e) {
    next(e)
  }
};

// const addMoreDataToOrder = async (orders) => {
//   const newOrders = [];
//   for (const el of orders) {
//     const product = await Product.findById({ _id: el.productId }, {
//       reviews: 0,
//       originalPrice: 0
//     });
//     const newOrderForm = { ...el._doc };
//     newOrderForm.OrderedProduct = product;
//     newOrderForm.OrderedProperties = el.orderItems.map(orderProperty => {
//       const propertiesNewForm = product.properties.find(property => property._id.toString() === orderProperty.propertyId.toString());
//       propertiesNewForm.amount = orderProperty.quantity;
//       return propertiesNewForm;
//     })
//     newOrders.push(newOrderForm)
//   }
//   return newOrders;
// }
// const getSellerOrders = async (req, res, next) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return next(ServerError.badRequest(401, "token is not valid"));
//     }
//     if (user.role !== 'seller') {
//       return next(ServerError.badRequest(401, "not authorized"));
//     }
//     const orders = await ApiFeatures.pagination(
//       Order.find({ sellerId: user._id }, {
//         productId: 1,
//         orderItems: 1,
//         totalPrice: 1,
//         name: 1,
//         phone: 1,
//         city: 1,
//         area: 1,
//         address: 1,
//         subAddress: 1,
//         shippingPrice: 1,
//         storeName: 1,
//         comment: 1,
//         orderState: 1,
//         createdAt: 1
//       }, { orderState: { $ne: 0 } })
//       , req.query)
//     const ordersNewForm = await addMoreDataToOrder(orders);
//     // console.log(ordersNewForm)
//     const totalLength = await Order.countDocuments({ sellerId: user._id })
//     // await req.user.populate('sellerOrders', {
//     // productId: 1,
//     //   orderItems: 1,
//     //   totalPrice: 1,
//     //   name: 1,
//     //   phone: 1,
//     //   city: 1,
//     //   area: 1,
//     //   address: 1,
//     //   subAddress: 1,
//     //   shippingPrice: 1,
//     //   storeName: 1,
//     //   comment: 1,
//     //   orderState: 1,
//     //   createdAt: 1
//     // }, { orderState: { $ne: 0 } }
//     // )
//     // const allOrders = req.user.sellerOrders; // all orders
//     res.status(200).json({
//       ok: true,
//       code: 200,
//       message: 'succeeded',
//       body: ordersNewForm,
//       totalLength
//     })
//   } catch (e) {
//     next(e)
//   }
// }


const auth = async (req, res, next) => {
  try {
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e)
  }
}

const changePassword = async (req, res, next) => {
  try {
    if (!req.user)
      return next(ServerError.badRequest(400, "token is not valid"));
    const user = req.user;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    if (password === newPassword)
      return next(ServerError.badRequest(400, "old and new password are same"));
    const isMatched = await user.validatePassword(password);
    if (!isMatched)
      return next(ServerError.badRequest(400, "wrong password"));
    user.password = newPassword;
    await user.save()
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'password has been updated successfully',
    })
  } catch (e) {
    // next(ServerError.badRequest(500, e.message))
    next(e)
    // res.status.apply(500).send(e.message);
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const resetLink = req.params.token
    const newPassword = req.body.password
    if (!resetLink) {
      return next(ServerError.badRequest(401, 'Authentication error!'))
    }
    if (!newPassword) {
      return next(ServerError.badRequest(401, 'Password is required'))
    }
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetLink)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next( ServerError.badRequest(400, 'Token is invalid or has expired'));
    }

    // 3) Check if the new password is same as the old password
    const validatePassword = await user.validatePassword(newPassword, user.password);
    console.log(newPassword, user.password, validatePassword)
    if (validatePassword) {
      return next( ServerError.badRequest(400, 'Password is same as old password'));
    }
    // 4) Update changedPasswordAt property for the user
    user.password = newPassword;
    user.resetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 5) Log the user in, send JWT
    sendToken(user, 200, res);

  } catch (e) {
    next(e)
  }
}


const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body
    const url = 'https://hatlystore.trendlix.com/change-password'
    const user = await User.findOne({ phone })
    if (!user) {
      // return res.status(404).send('user with this email dose not exist')
      return next(ServerError.badRequest(400, 'No user found with this phone'))
    }
    const token = user.getResetPasswordToken();
    // const token = jwt.sign({ _id: user._id }, 'resetPassword', { expiresIn: '20m' })

    await user.save({ validateBeforeSave: false });
    sendSMS(phone, `Use this link to reset your password  ${url}?token=${token}`)

    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: 'check your phone number'
    })
    // user.updateOne({ resetLink: token }, function (err, success) {
    //   if (err) {
    //     return next(ServerError.badRequest(400, 'something went wrong'))
    //   }
    //   else {
    //     sendSMS(phone,`use this link to reset your password \n ${url}/${token}`)
    //   }
    // })
    // })
  }
  catch (e) {
    // e.statusCode = 400
    console.log(e)
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // res.status(500).send(e.message)
  }
}

const logout = async (req, res, next) => {
  try {
    // console.log(req.user.tokens)
    console.log(req.cookies.access_token)
    req.user.tokens = req.user.tokens.filter((el) => {
      return el != req.cookies.access_token;
    });
    // res.cookie("token", null, {
    //   expires: new Date(Date.now()),
    //   httpOnly: true,
    // });
    await req.user.save();
    res.status(200).clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ,
      path: '/',
      domain: process.env.NODE_ENV !== 'production' ? "localhost" : ".trendlix.com",
      sameSite: 'none',
    }).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    // e.statusCode = 400
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // res.status(500).send(e.message);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    // e.statusCode = 400
    next(e)
    // next(ServerError.badRequest(500, e.message))
    // console.log(e);
    // res.status(500).send(e);
  }
};

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const sql = `INSERT INTO tabCustomer SET idx = ?,id = ?,name = ?,customer_name = ?,email_id = ?,mobile_no = ?, customer_primary_contact = ? ,language = ?,territory = ? ,customer_group = ?,customer_type = ?,owner = ?,modified_by = ?;`

    // const user = db.query(sql,[
    //   data.id,
    //   data.id,
    //   `${data.fName} ${data.lName}_${Date.now()}`,
    //   `${data.fName} ${data.lName}`,
    //   data.email,
    //   data.phone,
    //   'en',
    //   'All Territories',
    //   'All Customer Groups',
    //   'Individual',
    //   'admin@hatlystore.com',
    //   'admin@hatlystore.com',
    //   Date(),
    //   Date(),
    // ], (err,result)=>{
    //   if(err)
    //     console.log(err)
    //   res.status(201).json(
    //     {
    //       ok:true,
    //       status : 201,
    //       data : result
    //     }
    //   )
    // })
    const user = db.query(sql, [
      data.id,
      data.id,
      `${data.fName} ${data.lName}_${Date.now()}`,
      `${data.fName} ${data.lName}`,
      data.email,
      data.phone,
      data.phone,
      'en',
      'All Territories',
      'All Customer Groups',
      'Individual',
      'admin@hatlystore.com',
      'admin@hatlystore.com',
      // Date(),
      // Date(),
    ], (err, result) => {
      if (err)
        console.log(err)
      res.status(201).json(
        {
          ok: true,
          status: 201,
          data: result
        }
      )
    })
  } catch (e) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: e.message
    })
  }
}

module.exports = {
  addUser,
  signup,
  login,
  logout,
  getUserInfo,
  updateUser,
  auth,
  forgotPassword,
  resetPassword,
}