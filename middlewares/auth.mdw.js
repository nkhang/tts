const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (res.locals.isAuth == false) {
    return res.status(400).json({
      success: false,
      message: "permission denied"
    });
  }
  console.log(res.locals.user);
   next();
};
