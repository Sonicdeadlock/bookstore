/**
 * Created by alexthomas on 4/5/16.
 */
var config = require('../config.js');
var express = require('express');
var router = express.Router();
var books = require('./api/books');
var professors = require('./api/professors');
var courses = require('./api/courses');
var cart = require('./api/cart');

router.use('/books', books);
router.use('/professors', professors);
router.use('/courses', courses);
router.use('/cart', cart);

module.exports = router;