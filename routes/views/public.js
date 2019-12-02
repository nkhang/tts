var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  if (res.locals.user) {
    console.log(res.locals.user);
    return res.render("main", { user: res.locals.user })

  }
  res.render("main");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/forgotPassword", (req, res, next) => {
  res.render("forgotpassword");
});

router.get("/prices", (req, res, next) => {
  res.render("prices");
});

router.get("/manage", (req, res, next) => {
  res.render("manage");
});

router.get("/purchase", (req, res, next) => {
  packId = req.query.pack;
  if (packId === undefined || packId < 1 || packId > 3)
    packId = 2;

  res.render("purchase", { packId, user: res.locals.user });
});

router.get("/service", (req, res, next) => {
  // TODO: trang quản lý dịch vụ
  packId = 2;
  res.render("purchase", { packId, user: res.locals.user });
});

module.exports = router;
