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
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader); // Log auth header

    const token = req.body.token;
    console.log('Token from body:', token); // Log token from body

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        console.error('JWT Error:', err);
        return res.status(403).json({ message: 'Invalid token' });
      }
      console.log('User:', user); // Log user
      const userData = await User.findById(user.id);
      const userDoc = {...userData._doc}
      delete userDoc.tokens
      delete userDoc.password
      delete userDoc.resetToken
      res.status(200).json({
        ok: true,
        code: 200,
        message: 'Succeeded',
        body: userDoc
      });
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
      // passwordResetToken: hashedToken,
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
    const url = process.env.NODE_ENV === 'production' ? 'https://hatlystore.trendlix.com/change-password' : 'http://localhost:3000/change-password'
    const user = await User.findOne({ phone })
    if (!user) {
      // return res.status(404).send('user with this email dose not exist')
      return next(ServerError.badRequest(400, 'No user found with this phone'))
    }
    const token = user.getResetPasswordToken();
    // const token = jwt.sign({ _id: user._id }, 'resetPassword', { expiresIn: '20m' })

    await user.save({ validateBeforeSave: false });
    sendSMS(phone, `Use this link to reset your password ${url}?token=${token}`)

    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: 'check your phone number'
    })

    // User.updateOne({ resetLink: token }, function (err, success) {
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
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    console.log('Access token from cookie:', token);
    
    // Filter out the token to remove it from user's tokens
    req.user.tokens = req.user.tokens.filter((el) => el !== token);
    
    await req.user.save();
    
    // Clear the cookie by setting its expiration time to a past date
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set expiration time to a past date
      path: '/',
      domain: process.env.NODE_ENV !== 'production' ? "localhost" : ".trendlix.com",
      sameSite : process.env.NODE_ENV === 'production' ? 'None': 'lax',
    }).status(200).json({
      ok: true,
      code: 200,
      message: 'Logout succeeded',
    });
  } catch (e) {
    console.error('Logout error:', e.message);
    next(e);
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