/**
 * Created by alexthomas on 4/25/2016.
 */
var should = require('should');
var assert = require('assert');
var _ = require('lodash');
var datastore = require('../datastore');
var config = require('../config');
var app = require('../server');
var supertest = require('supertest');
var Session = require('supertest-session')({app: app});

describe('The Cart API', function () {
    describe(' add an item to the cart', function () {
        var request;
        before(function () {
            request = new Session();
        });
        it('should add a new item to the cart', function (done) {
            setTimeout(function () {//give the datastore time to read the file
                var book = datastore.searchISBN('978-0073376356');
                book.purchaseType = 'NEW';
                request
                    .post('/api/cart/add')
                    .send(book)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        else
                            done();
                    });
            }, 100);

        });
        it('should add a used item to the cart', function (done) {
            setTimeout(function () {//give the datastore time to read the file
                var book = datastore.searchISBN('978-0073376356');
                book.purchaseType = 'USED';
                request
                    .post('/api/cart/add')
                    .send(book)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        else
                            done();
                    });
            }, 100);

        });
        it('should add a rented item to the cart', function (done) {
            setTimeout(function () {//give the datastore time to read the file
                var book = datastore.searchISBN('978-0073376356');
                book.purchaseType = 'RENT';
                request
                    .post('/api/cart/add')
                    .send(book)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        else
                            done();
                    });
            }, 100);

        });
        it('should add a EBook item to the cart', function (done) {
            setTimeout(function () {//give the datastore time to read the file
                var book = datastore.searchISBN('978-0073376356');
                book.purchaseType = 'EBOOK';
                request
                    .post('/api/cart/add')
                    .send(book)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        else
                            done();
                    });
            }, 100);

        });
        it('should fail to add an item that doesn\'t exist to the cart', function (done) {
            var book = datastore.searchISBN('978-007337635609');
            if (book) {
                done('test book exists and it shouldn\'t');
            }
            else {
                request
                    .post('/api/cart/add')
                    .send(book)
                    .expect(304)
                    .end(function (err, res) {
                        if (err) done(err);
                        else
                            done();
                    });
            }

        });

    });

    describe(' an added item should be in the cart', function () {

        var request;
        before(function (done) {
            request = new Session();
            setTimeout(function () {//give the datastore time to load the data
                var book = datastore.searchISBN('978-0073376356');
                book.purchaseType = 'NEW';
                request.post('/api/cart/add').send(book).end(done);
            })

        });
        it('should have a cart count of 1', function (done) {
            request.get('/api/cart/count')
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    res.body.should.be.equal(1)
                    done();
                })
        })
        it('should have one item in the cart', function (done) {
            request.get('/api/cart')
                .expect(200)
                .end(function (err, res) {
                    if (err) done(err);
                    var body = res.body;
                    var book = datastore.searchISBN('978-0073376356');
                    body.should.be.an.instanceOf(Array).and.have.length(1);
                    body = body[0];
                    body.ISBN.should.equal(book.ISBN);
                    body.title.should.equal(book.title);
                    body.author.should.equal(book.author);
                    body.semester.should.equal(book.semester);
                    body.course.should.equal(book.course);
                    body.section.should.equal(book.section);
                    body.professor.should.equal(book.professor);
                    body.CRN.should.equal(book.CRN);
                    body.use.should.equal(book.use);
                    body.quantityNew.should.equal(book.quantityNew);
                    body.quantityUsed.should.equal(book.quantityUsed);
                    body.quantityRental.should.equal(book.quantityRental);
                    body.quantityEBook.should.equal(book.quantityEBook);
                    body.priceNew.should.equal(book.priceNew);
                    body.priceUsed.should.equal(book.priceUsed);
                    body.priceRental.should.equal(book.priceRental);
                    body.priceEBook.should.equal(book.priceEBook);
                    body.description.should.equal(book.description);
                    done();

                });
        });
        it('should have two items in the cart', function (done) {
            var book = datastore.searchISBN('978-0073376356');
            request.post('/api/cart/add').send(book).end(function () {

                request.get('/api/cart')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        var body = res.body;
                        body.should.be.an.instanceOf(Array).and.have.length(2);
                        done();
                    });
            });

        })
    });

    describe(' delete an item from the cart', function () {
        var book1;
        var book2;
        var cart;
        var request;
        var testCartPromise;
        before(function (done) {
            setTimeout(function () {
                request = new Session();
                book1 = datastore.bookData[0];
                book1.purchaseType = 'NEW';
                book2 = datastore.bookData[1];
                book2.purchaseType = 'NEW';
                request.post('/api/cart/add').send(book1).end(function () {
                    request.post('/api/cart/add').send(book2).end(function () {
                        request.get('/api/cart').end(function (err, res) {
                            cart = res.body;
                            done();
                        })
                    });
                });
            }, 100);
        });

        it(' should delete the first book from the cart', function (done) {
            testCartPromise = new Promise(function (resolve, reject) {
                request.delete('/api/cart/delete/' + cart[0].id)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);
                        request.get('/api/cart').end(function (err, res) {
                            if (err) done(err);
                            else {
                                cart = res.body;
                                cart.should.have.length(1);
                                book2.id = cart[0].id;
                                book2.quantity = cart[0].quantity;
                                book2.totalPrice = cart[0].totalPrice;
                                cart[0].should.eql(book2);
                                done();
                            }

                        })
                    })
            });

        });

        it('should delete the second book from the cart', function (done) {
            var request = new Session();
            var book1 = datastore.bookData[0];
            var book2 = datastore.bookData[1];
            var cart;
            request.post('/api/cart/add').send(book1).end(function () {
                request.post('/api/cart/add').send(book2).end(function () {
                    request.get('/api/cart').end(function (err, res) {
                        cart = res.body;
                        request.delete('/api/cart/delete/' + cart[1].id)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) done(err);
                                request.get('/api/cart').end(function (err, res) {
                                    if (err) done(err);
                                    else {
                                        cart = res.body;
                                        cart.should.have.length(1);
                                        book1.id = cart[0].id;
                                        book1.quantity = cart[0].quantity;
                                        book1.totalPrice = cart[0].totalPrice;
                                        cart.should.containEql(book1);
                                        done();
                                    }
                                })
                            });
                    })
                });
            });
        })


        it('should do nothing when deleting a book from the cart that isn\'t in the cart', function (done) {
            var request = new Session();
            var book1 = datastore.bookData[0];
            var book2 = datastore.bookData[1];
            var cart;
            request.post('/api/cart/add').send(book1).end(function () {
                request.post('/api/cart/add').send(book2).end(function () {
                    request.get('/api/cart').end(function (err, res) {
                        cart = res.body;
                        request.delete('/api/cart/delete/invalidID')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) done(err);
                                request.get('/api/cart').end(function (err, res) {
                                    if (err) done(err);
                                    else {
                                        cart = res.body;
                                        cart.should.have.length(2);
                                        done();
                                    }

                                })
                            });
                    })
                });
            });
        })


    })

    describe(' update an item in the cart', function () {
        var book1;
        var book2;
        before(function (done) {
            setTimeout(function () {
                book1 = datastore.bookData[0];
                book2 = datastore.bookData[1];
                done();
            }, 100);
        })
        function putTwoItemsInTheCart(request, callback) {
            var cart;
            request.post('/api/cart/add').send(book1).end(function () {
                request.post('/api/cart/add').send(book2).end(function () {
                    request.get('/api/cart').end(function (err, res) {
                        callback(request, res.body);
                    })
                });
            });
        }

        function testModifyBookSuccess(newBookData, changeFirst, expectSame, title) {
            var request = new Session();
            it(title, function (done) {
                putTwoItemsInTheCart(request, function (reques, cart) {
                    var changedBook = _.clone(cart[changeFirst ? 0 : 1]);
                    if (newBookData['purchaseType']) {
                        changedBook.purchaseType = newBookData.purchaseType;
                    }
                    if (newBookData['quantity']) {
                        changedBook.quantity = newBookData.quantity;
                    }
                    request.put('/api/cart')
                        .send(changedBook)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) done(err);
                            else {
                                request.get('/api/cart').end(function (err, res) {
                                    if (err) done(err);
                                    else {
                                        var body = res.body;
                                        body.should.have.length(2);
                                        body[changeFirst ? 0 : 1].should.eql(changedBook);
                                        body[changeFirst ? 1 : 0].should.eql(cart[changeFirst ? 1 : 0]);
                                        if (!expectSame)
                                            body.should.not.containEql(cart[changeFirst ? 0 : 1]);
                                        else
                                            body.should.containEql(cart[changeFirst ? 0 : 1]);
                                        done();
                                    }
                                })
                            }
                        })
                })
            })

        }

        function testModifyBookFail(newBookData, changeFirst, title) {
            title += ' (' + JSON.stringify(newBookData) + ')';
            var request = new Session();
            it(title, function (done) {
                putTwoItemsInTheCart(request, function (reques, cart) {
                    var changedBook = _.clone(cart[changeFirst ? 0 : 1]);
                    if (newBookData['purchaseType']) {
                        changedBook.purchaseType = newBookData.purchaseType;
                    }
                    if (newBookData['quantity']) {
                        changedBook.quantity = newBookData.quantity;
                    }
                    request.put('/api/cart')
                        .send(changedBook)
                        .expect(304)
                        .end(function (err, res) {
                            if (err) done(err);
                            else {
                                request.get('/api/cart').end(function (err, res) {
                                    if (err) done(err);
                                    else {
                                        var body = res.body;
                                        body.should.have.length(2);
                                        body.should.eql(cart);
                                        done();
                                    }
                                })
                            }
                        })
                })
            })

        }

        testModifyBookSuccess({quantity: 2}, true, false, "should change the quantity of the first book in the cart");
        testModifyBookSuccess({quantity: 1}, true, true, "should change the quantity of the first book in the cart");
        testModifyBookSuccess({quantity: 2}, false, false, "should change the quantity of the second book in the cart");
        testModifyBookSuccess({quantity: 1}, false, true, "should change the quantity of the second book in the cart");


        testModifyBookSuccess({purchaseType: 'NEW'}, true, true, "should change the type of the first book in the cart to new");
        testModifyBookSuccess({purchaseType: 'USED'}, true, false, "should change the type of the first book in the cart to used");
        testModifyBookSuccess({purchaseType: 'RENT'}, true, false, "should change the type of the first book in the cart to rental");
        testModifyBookSuccess({purchaseType: 'EBOOK'}, true, false, "should change the type of the first book in the cart to ebook");
        testModifyBookSuccess({purchaseType: 'NEW'}, false, true, "should change the type of the second book in the cart to new");
        testModifyBookSuccess({purchaseType: 'USED'}, false, false, "should change the type of the second book in the cart to used");
        testModifyBookSuccess({purchaseType: 'RENT'}, false, false, "should change the type of the second book in the cart to rental");
        testModifyBookSuccess({purchaseType: 'EBOOK'}, false, false, "should change the type of the second book in the cart to ebook");

        testModifyBookFail({quantity: Infinity}, true, 'should fail to change the quantity of the first book to an invalid value');
        testModifyBookFail({quantity: "some text"}, true, 'should fail to change the quantity of the first book to an invalid value');
        testModifyBookFail({quantity: "one"}, true, 'should fail to change the quantity of the first book to an invalid value');
        testModifyBookFail({quantity: "two"}, true, 'should fail to change the quantity of the first book to an invalid value');
        testModifyBookFail({quantity: Infinity}, false, 'should fail to change the quantity of the second book to an invalid value');
        testModifyBookFail({quantity: "some text"}, false, 'should fail to change the quantity of the second book to an invalid value');
        testModifyBookFail({quantity: "one"}, false, 'should fail to change the quantity of the second book to an invalid value');
        testModifyBookFail({quantity: "two"}, false, 'should fail to change the quantity of the second book to an invalid value');

        testModifyBookFail({purchaseType: 1}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'one'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'new'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'New'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'nEW'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'rent'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'used'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'ebook'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'Rent'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'Used'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'Ebook'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 'EBook'}, true, 'should fail to change the purchase type of the first book to an invalid value');
        testModifyBookFail({purchaseType: 1}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'one'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'new'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'New'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'nEW'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'rent'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'used'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'ebook'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'Rent'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'Used'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'Ebook'}, false, 'should fail to change the purchase type of the second book to an invalid value');
        testModifyBookFail({purchaseType: 'EBook'}, false, 'should fail to change the purchase type of the second book to an invalid value');


    })

});