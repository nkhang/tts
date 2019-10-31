const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies.jwt;
  if (token == null || token == undefined) {
   res.locals.isAuth = false;
   res.locals.user = null;;
   next()
   return; 
  }
  let payload = jwt.verify(token, "StRoNGs3crE7");
  if (payload == null || payload == undefined) {
   res.locals.isAuth = false;
   res.locals.user = null;
   next();
   return; 
  }
  res.locals.isAuth = true
  res.locals.user = payload.user
  next();
};

