/**
 * Created by alexthomas on 4/6/16.
 */
var express = require('express');
var router = express.Router();

router.route('/login')
    .post(function (req, res) {
        if (req.body.username.match(new RegExp('(^[A-Za-z]{5,8}[1-9]{0,})')) == null) {
            res.status(403).send('Invalid Username');
        }
        else if (req.body.password == '12345678') {
            var user = {
                shippingInformation: {
                    first_name: req.body.username[0],
                    last_name: req.body.username.substr(1, 4),
                    address: 'dummy address',
                    state: 'dummy state',
                    zip: '30043',
                    city: 'dummy city'
                }
            };
            req.session.user = user;
            res.status(200).json(user);
        }
        else {
            res.status(403).send('Invalid Password');
        }

    });

router.route('/self')
    .get(function (req, res) {
        if (req.session.user) {
            res.json(req.session.user);
        } else {
            res.status(404).send('User not found')
        }
    });
module.exports = router;