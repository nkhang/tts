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


module.exports = router;
