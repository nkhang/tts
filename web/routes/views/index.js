var express = require('express');
var router = express.Router();
var publicRoutes = require('./public');
var stepRoutes = require('./step')
const authmdw = require('../../middlewares/auth.mdw');

router.use('/', publicRoutes)
router.use('/step', authmdw, stepRoutes)

router.get("/profile", authmdw, (req, res, next) => {
    res.render("profile", {user: res.locals.user});
  });

router.get("/profile", (req, res, next) => {
    res.render("profile");
  });

module.exports = router;
