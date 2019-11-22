const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies.jwt;
  if (token == null || token == undefined) {
    res.locals.isAuth = false;
    res.locals.user = null;;
    next()
    return;
  }
  return jwt.verify(token, "StRoNGs3crE7", (err, payload) => {
    if (err) {
      res.locals.isAuth = false;
      res.locals.user = null;
      next()
    }
    res.locals.isAuth = true
    res.locals.user = payload.user
    next()
  });
};

