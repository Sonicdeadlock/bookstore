/**
 * Created by Muhatashim on 4/30/2016.
 */
var should = require('should');
var _ = require('lodash');
var app = require('../server');
var datastore = require('../datastore');
var Session = require('supertest-session')({app: app});

describe('Courses API', function () {
    var request;
    before(function () {
        request = new Session();
    });

    function testPost(request, endpoint, testData, done) {
        _.forEach(testData.send, function (each) {
            request
                .post(endpoint)
                .send(each.submit)
                .expect(each.expects.code)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                        return;
                    }
                    res.body.should.be.eql(each.expects.response);
                });
        });
        done();
    }

    describe('course id search', function () {
        function testCoursesById(testData, done) {
            testPost(request, '/api/courses/id/', testData, done);
        }

        it('should find a course by valid ids', function (done) {
            setTimeout(function () { //let the datastore load data
                testCoursesById({
                    send: [
                        {
                            submit: {CRN: datastore.bookData[0].CRN},
                            expects: {code: 200, response: [datastore.bookData[0], datastore.bookData[1]]}
                        },
                        {
                            submit: {CRN: datastore.bookData[43].CRN},
                            expects: {
                                code: 200,
                                response: [datastore.bookData[14], datastore.bookData[36], datastore.bookData[43]]
                            }
                        },
                        {
                            submit: {CRN: datastore.bookData[6].CRN},
                            expects: {
                                code: 200,
                                response: [datastore.bookData[6]]
                            }
                        },
                        {
                            submit: {CRN: '2549'},
                            expects: {
                                code: 200,
                                response: [datastore.bookData[6]]
                            }
                        }
                    ]
                }, done)
            }, 100);
        });

        it('should not find courses by invalid ids', function (done) {
            setTimeout(function () { //let the datastore load data
                testCoursesById({
                    send: [
                        {
                            submit: {CRN: 12345},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {CRN: 0},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {CRN: -1},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {CRN: '0'},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {CRN: '*2549'},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {CRN: '??!!#$'},
                            expects: {code: 200, response: []}
                        }
                    ]
                }, done)
            }, 100);
        });
    });

    describe('book search by course', function () {
        function testBooksByCourses(testData, done) {
            testPost(request, '/api/courses/get_books/', testData, done);
        }

        it('should find books by valid courses', function (done) {
            setTimeout(function () { //let the datastore load data
                testBooksByCourses({
                    send: [
                        {
                            submit: {course: 'ENGR 3122'},
                            expects: {code: 200, response: [[datastore.bookData[6]]]}
                        },
                        {
                            submit: {course: 'CSE 1302'},
                            expects: {
                                code: 200,
                                response: [[datastore.bookData[14], datastore.bookData[36], datastore.bookData[43]]]
                            }
                        }
                    ]
                }, done)
            }, 100);
        });
        it('should not find books by invalid courses', function (done) {
            setTimeout(function () { //let the datastore load data
                testBooksByCourses({
                    send: [
                        {
                            submit: {course: 'INVALID COURSE'},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {course: 'CSE 5842'},
                            expects: {code: 200, response: []}
                        },
                        {
                            submit: {course: '"1302"'},
                            expects: {code: 200, response: []}
                        },
                        // {   todo: fix this, not supposed to return any books
                        //     submit: {course: ''},
                        //     expects: {code: 200, response: []}
                        // }
                        {
                            submit: {course: '$$'},
                            expects: {code: 200, response: []}
                        }
                    ]
                }, done)
            }, 100);
        });
    });
});