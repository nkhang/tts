const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
require("../db");

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
    // res.locals.isAuth = true
    UserModel.findById(payload.user._id, (err, user) => {
      if (err) {
        console.log(`ERROR: in find by id ${err}`);
        res.locals.isAuth = false;
        res.locals.user = null;
        next();
        return
      }
      res.locals.isAuth = true;
      res.locals.user = user;
      return next();
    })
    // res.locals.user = payload.user
    // next()
  });
};

