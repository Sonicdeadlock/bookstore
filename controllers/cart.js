/**
 * Created by Sonicdeadlock on 3/7/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');
var uid = require('uid');
var fs = require('fs');

function add(req, res) {
    var cart = req.session.cart || [];
    req.body.id = uid();
    if (req.body.quantity < 0) {
        res.status(403).send('invalid quantity');
        return;
    }
    switch (req.body.purchaseType) {
        case 'RENT':
            req.body.totalPrice = datastore.searchISBN(req.body.ISBN).priceRental * req.body.quantity;
            break;
        case "NEW":
            req.body.totalPrice = datastore.searchISBN(req.body.ISBN).priceNew * req.body.quantity;
            break;
        case "USED":
            req.body.totalPrice = datastore.searchISBN(req.body.ISBN).priceUsed * req.body.quantity;
            break;
        case "EBOOK":
            req.body.totalPrice = datastore.searchISBN(req.body.ISBN).priceEBook;
            break;
    }
    cart.push(req.body);
    req.session.cart = cart;
    res.status(200).send();
}

function remove(id) {
    req.session.cart = _.reject(req.session.cart, {id: id});
}

function count(req, res) {
    if (!req.session.cart) {
        res.json(0);
    }
    else {
        res.json(req.session.cart.length);
    }
}

function get(req, res) {
    res.json(req.session.cart);
}

function checkout(req, res) {
    if (!req.session.cart) {
        res.status(404).send();
    }
    else {
        var cart = req.session.cart;
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            switch (item.purchaseType) {
                case 'RENT':
                    if (datastore.searchISBN(item.ISBN).quantityRental < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type:' + item.purchaseType);
                        return;
                    }
                    break;
                case "NEW":
                    if (datastore.searchISBN(item.ISBN).quantityNew < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type:' + item.purchaseType);
                        return;
                    }
                    break;
                case "USED":
                    if (datastore.searchISBN(item.ISBN).quantityUsed < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type:' + item.purchaseType);
                        return;
                    }
                    break;
                case "EBOOK":
                    break;
            }
        }
        var total = 0;
        cart.forEach(function (item) {
            switch (item.purchaseType) {
                case 'RENT':
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityRental');
                    total += item.totalPrice;
                    break;
                case "NEW":
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityNew');
                    total += item.totalPrice;
                    break;
                case "USED":
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityUsed');
                    total += item.totalPrice;
                    break;
                case "EBOOK":
                    total += item.totalPrice;
                    break;
            }
        });
        var receipt = {
            items: _.cloneDeep(cart),
            total: total,
            id: uid(),
            payment: req.body
        };
        //todo:store receipt
        res.json(receipt);
        req.session.cart = [];
    }
}

module.exports.add = add;
module.exports.remove = remove;
module.exports.remove_request = function (req, res) {
    remove(req.params.item_id).then(function () {
        res.status(200).send();
    })
};
module.exports.count = count;
module.exports.get = get;
module.exports.checkout = checkout;