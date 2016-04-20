/**
 * Created by alexthomas on 4/6/16.
 */
var express = require('express');
var router = express.Router();

router.route('/login')
    .post(function (req, res) {
        if (req.body.password == '1234') {
            res.status(200).json({
                shippingInformation: {
                    first_name: 'dummy name',
                    last_name: 'dummy name',
                    address: 'dummy address',
                    state: 'dummy state',
                    zip: 'dummy zip',
                    city: 'dummy city'
                }
            });
        }
        else {
            res.status(403).send('Invalid Password')
        }

    });

module.exports = router;