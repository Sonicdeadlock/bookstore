/**
 * Created by Sonicdeadlock on 3/7/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');
var uid = require('uid');
var fs = require('fs');

function add(req, res) {
    if (
        _.isNull(req.body.ISBN) ||
        _.isNull(req.body.title) ||
        _.isNull(req.body.author) ||
        _.isNull(req.body.semester) ||
        _.isNull(req.body.course) ||
        _.isNull(req.body.section) ||
        _.isNull(req.body.professor) ||
        _.isNull(req.body.CRN) ||
        _.isNull(req.body.use) ||
        _.isNull(req.body.quantityNew) ||
        _.isNull(req.body.quantityUsed) ||
        _.isNull(req.body.quantityRental) ||
        _.isNull(req.body.quantityEBook) ||
        _.isNull(req.body.priceNew) ||
        _.isNull(req.body.priceUsed) ||
        _.isNull(req.body.priceRental) ||
        _.isNull(req.body.priceEBook) ||
        _.isNull(req.body.description)
    ) {
        res.status(304).send('Invalid Book')
    }
    else {
        var cart = req.session.cart || [];
        req.body.id = uid();
        req.body.quantity = req.body.quantity || 1;
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

}

function update(req, res) {
    var index = _.findIndex(req.session.cart, {id: req.body.id});
    if (index != -1) {
        req.session.cart[index] = req.body;
        res.status(200).send();
    }
    else {
        res.status(404).send();
    }
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
    } else if (req.body.billingInformation.paymentMethod === 'CreditCard' && !isValidCreditCard(req.body.billingInformation)) {
        res.status(403).send('Invalid Credit Card information');
    } else if (req.body.billingInformation.paymentMethod === 'Paypal' && req.body.billingInformation.paypalPassword !== '12345678') {
        res.status(403).send('Invalid Paypal login');
    }
    else {
        var cart = req.session.cart;
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            switch (item.purchaseType) {
                case 'RENT':
                    if (datastore.searchISBN(item.ISBN).quantityRental < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type: ' + item.purchaseType);
                        return;
                    }
                    break;
                case "NEW":
                    if (datastore.searchISBN(item.ISBN).quantityNew < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type: ' + item.purchaseType);
                        return;
                    }
                    break;
                case "USED":
                    if (datastore.searchISBN(item.ISBN).quantityUsed < item.quantity) {
                        res.status(403).send('Not Enough Quantity of book: ' + item.title + ' and type: ' + item.purchaseType);
                        return;
                    }
                    break;
                case "EBOOK":
                    if (datastore.searchISBN(item.ISBN).quantityEBook == 0) {
                        res.status(403).send(item.title + ' is not offered as an EBook')
                    }
                    break;
            }
        }
        var total = 0;
        cart.forEach(function (item) {
            switch (item.purchaseType) {
                case 'RENT':
                    if (item.quantity !== 'inf')
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityRental');
                    item.type = 'Rental';
                    total += item.totalPrice;
                    break;
                case "NEW":
                    if (item.quantity !== 'inf')
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityNew');
                    item.type = 'New';
                    total += item.totalPrice;
                    break;
                case "USED":
                    if (item.quantity !== 'inf')
                    datastore.increment(item.ISBN, item.quantity * -1, 'quantityUsed');
                    item.type = 'Used';
                    total += item.totalPrice;
                    break;
                case "EBOOK":
                    total += item.totalPrice;
                    item.type = 'EBook';
                    break;
            }
        });
        var receipt = {
            items: _.cloneDeep(cart),
            total: total,
            id: uid(),
            payment: req.body.billingInformation,
            shipping: req.body.shippingInformation
        };
        req.session.cart = [];
        //todo:store receipt
        res.json(receipt);

    }
}

function isValidCreditCard(creditCardData) {
    if (!creditCardData)
        return false;
    if (creditCardData.cvv !== 777)
        return false;
    if (!Number(creditCardData.credit_card_number))
        return false;
    if (String(creditCardData.credit_card_number).length !== 16)
        return false;
    if (creditCardData.expiration < _.now())
        return false;
    return true;
}

module.exports.add = add;
module.exports.remove_request = function (req, res) {
    req.session.cart = _.reject(req.session.cart, {id: req.params.item_id});
        res.status(200).send();
};
module.exports.count = count;
module.exports.get = get;
module.exports.checkout = checkout;
module.exports.update = update;
module.exports.isValidCreditCard = function (req, res) {
    res.json(isValidCreditCard(req.body));
};