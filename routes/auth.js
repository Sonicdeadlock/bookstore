/**
 * Created by alexthomas on 4/6/16.
 */
var express = require('express');
var router = express.Router();

router.route('/login')
    .post(function (req, res) {
        if (req.body.username.match(new RegExp('(^[A-Za-z]{5}[1-9]+)')) == null) {
            res.status(403).send('Invalid Username');
        }
        else if (req.body.password == '12345678') {
            res.status(200).json({
                shippingInformation: {
                    first_name: req.body.username[0],
                    last_name: req.body.username.substr(1, 4),
                    address: 'dummy address',
                    state: 'dummy state',
                    zip: 'dummy zip',
                    city: 'dummy city'
                }
            });
        }
        else {
            res.status(403).send('Invalid Password');
        }

    });

module.exports = router;