/**
 * Created by alexthomas on 4/6/16.
 */
var express = require('express');
var router = express.Router();

router.route('/login')
    .post(function (req, res) {
        res.status(200).send();
    });

module.exports = router;