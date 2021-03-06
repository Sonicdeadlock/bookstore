/**
 * Created by Sonicdeadlock on 2/23/2016.
 */
var express = require('express');
var router = express.Router();
var bookController = require('../../controllers/book');


router.route('/author')
    .post(bookController.getByAuthor);

router.route('/title')
    .post(bookController.getByTitle);

router.route('/ISBN/:ISBN')
    .get(bookController.getByISBN)
    .post(bookController.getByISBN);

router.route('/getAll')
    .get(bookController.getAll);

router.route('/keyword')
    .post(bookController.getByKeyword);

module.exports = router;