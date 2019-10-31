var express = require('express');
var router = express.Router();
var publicRoutes = require('./public');

router.use('/', publicRoutes)

module.exports = router;
