var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  if (res.locals.user) {
    console.log(res.locals.user);
    return res.render("main", {user: res.locals.user})
    
  }
  res.render("main");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/prices", (req, res, next) => {
  res.render("prices");
});

router.get("/prices/step1", (req, res, next) => {
  res.render("step1");
});

router.get("/prices/step2", (req, res, next) => {
  res.render("step2");
});

router.get("/prices/step3", (req, res, next) => {
  res.render("step3");
});
module.exports = router;
