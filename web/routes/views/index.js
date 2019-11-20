var express = require('express');
var router = express.Router();
var publicRoutes = require('./public');
var stepRoutes = require('./step')
const authmdw = require('../../middlewares/auth.mdw');

router.use('/', publicRoutes)
router.use('/step', authmdw, stepRoutes)
module.exports = router;
