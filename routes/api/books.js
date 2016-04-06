/**
 * Created by Sonicdeadlock on 2/23/2016.
 */
var express = require('express');
var router = express.Router();
var bookController = require('../../controllers/book');


router.route('/author/:author')
    .get(bookController.getByAuthor);

router.route('/title/:title')
    .get(bookController.getByTitle);

router.route('/ISBN/:ISBN')
    .get(bookController.getByISBN);

router.route('/getAll')
    .get(bookController.getAll);

router.route('/keyword/:keywords')
    .get(bookController.getByKeyword);

module.exports = router;