/**
 * Created by Sonicdeadlock on 3/1/2016.
 */
var express = require('express');
var router = express.Router();
var professorController = require('../../controllers/professor');

router.route('/')
    .get(professorController.get);

router.route('/get_books')
    .post(professorController.get_books);


module.exports = router;