// Create Token and saving in cookie

const sendToken = async(user, statusCode, res) => {
  const token = await user.generateJWTToken();
  // console.log(token)
  const domain = process.env.NODE_ENV !== 'production' ? "localhost" : ".trendlix.com";
  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path : '/',
    domain, 
    sameSite : process.env.NODE_ENV === 'production' ? 'None': 'lax',
  };
  user.tokens = null
  user.password = null
  user.resetLink = null
  console.log('user after token generation', user)
  res.status(statusCode).cookie("access_token", token, options).json({
    success: true,
    user,
    token,
  });
  console.log(1)
};

module.exports = sendToken;