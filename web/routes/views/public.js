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

router.get("/purchase", (req, res, next) => {
  packId = req.query.pack;
  if (packId === undefined || packId < 1 || packId > 3)
    packId = 2;
  
  res.render("purchase", { packId, user: res.locals.user });
});

router.get("/service", (req, res, next) => {

  if (!res.locals.user || !res.locals.user.purchased || !res.locals.user.key)
    res.render("prices");
  Service.findOne({key : res.locals.user.key}).then(service => {
    if (service) {
      console.log(service);
      res.render("manage", { service });
    } else {
      res.render("prices");
    }
  });
  
});

router.get("/howToUse", (req, res, next) => {
  // TODO: điều hướng trang sử dụng ở đây
  res.render("prices");
});


router.get("/profile", (req, res, next) => {
  res.render("profile", {user: res.locals.user});
});

module.exports = router;
