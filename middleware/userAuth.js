const ServerError = require("../utils/ErrorInterface");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader); // Log auth header

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token); // Log token

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
};

// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHander(
//           `Role: ${req.user.role} is not allowed to access this resouce `,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
