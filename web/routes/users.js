var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(getAuthPath())
  res.send(global.config)
});

module.exports = router;
