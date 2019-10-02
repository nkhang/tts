var express = require('express');
var axios = require('axios')
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/', function(req, res, next) {
  res.render('main');
});


module.exports = router;
