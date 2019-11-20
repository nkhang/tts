var express = require('express');
var router = express.Router();
var publicRoutes = require('./public');

router.use('/', publicRoutes)

router.get("/profile", (req, res, next) => {
    res.render("profile");
  });

module.exports = router;
