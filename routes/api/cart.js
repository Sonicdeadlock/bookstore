/**
 * Created by Sonicdeadlock on 3/8/2016.
 */

var express = require('express');
var router = express.Router();
var cartController = require('../../controllers/cart');

router.route('/add')
    .post(cartController.add);

router.route('/count')
    .get(cartController.count);

router.route('/delete/:item_id')
    .delete(cartController.remove_request);

router.route('/')
    .get(cartController.get);

router.route('/checkout')
    .post(cartController.checkout);

module.exports = router;