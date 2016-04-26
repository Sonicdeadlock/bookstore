/**
 * Created by Sonicdeadlock on 3/1/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');


function get(req, res) {
    res.json(datastore.getCourses());
}

function getById(req, res) {
    var CRN = req.params.CRN;
    res.json(datastore.searchCRN(CRN));

}

function get_books(req, res) {
    var course = req.params.course;
    res.json(datastore.courseFormat(datastore.searchCourseFuzzy(course)));
}

module.exports.get_books = get_books;
module.exports.get = get;
module.exports.getById = getById;