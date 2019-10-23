var express = require('express');
var router = express.Router();
const querystring = require('querystring');    
var WorkerPath = require('../configs/authConfig')

router.get('/login', function(req, res, next) {
  var workerPath = WorkerPath()
  res.render('login', {authPath: workerPath});
});

router.get('/register', function(req, res, next) {
  var workerPath = WorkerPath()
  res.render('register', {authPath: workerPath});
});

router.get('/', function(req, res, next) {
  var workerPath = WorkerPath()  
  const user = (JSON.parse(JSON.stringify(req.query)));
  res.render('main', {authPath: workerPath, user: user.fullname});
});

router.get('/logout', function(req, res, next) {
  res.redirect('/');
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
