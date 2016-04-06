/**
 * Created by Sonicdeadlock on 3/1/2016.
 */
var express = require('express');
var router = express.Router();
var courseController = require('../../controllers/course');

router.route('/')
    .get(courseController.get);

router.route('/get_books/:course')
    .get(courseController.get_books);

router.route('/id/:CRN')
    .get(courseController.getById);

module.exports = router;