var express = require('express');
var router = module.exports = express.Router();


router.use('/run', require('./run'))
router.use('/build', require('./build'))
