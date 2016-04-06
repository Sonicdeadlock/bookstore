/**
 * Created by Sonicdeadlock on 2/23/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');


function get(req, res) {
    res.json(datastore.getProfessors());
}


function get_books(req, res) {
    var professor = req.params.professor;
    res.json(datastore.courseFormat(datastore.searchProfessor(professor)));
}

module.exports.get_books = get_books;
module.exports.get = get;
module.exports.getById = getById;



