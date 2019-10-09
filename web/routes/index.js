var express = require('express');
var router = express.Router();
var authPath = require('../configs/authConfig')


router.get('/login', function(req, res, next) {
  var authHost = authPath()
  console.log(authHost)
  res.render('login', {authPath: authHost});
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/paid', function(req, res, next) {
  res.render('step1', {step: 1});
});
router.get('/paid/choose-method', function(req, res, next) {
  res.render('step2', {step: 1});
});
router.get('/paid/otp', function(req, res, next) {
  res.render('step3', {step: 1});
});


module.exports = router;
