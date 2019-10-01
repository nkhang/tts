var express = require('express');
var axios = require('axios')
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   axios.get("http://authentication:3000/auth")
//   .then(resp => {
//     console.log(resp)
//     res.send("xxx" + resp.data)
//     return
//   })
//   .catch(error => {
//     console.log(error)
//     res.send(error)
//   })
//   // res.render('index', { title: 'Express' });
// });

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
