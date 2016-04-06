/**
 * Created by Sonicdeadlock on 2/23/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');


function getByTitle(req, res) {
    var title = req.params.title;
    res.json(datastore.searchTitle(title));

}

function getByISBN(req, res) {
    var ISBN = req.params.ISBN;
    res.json(datastore.searchISBN(ISBN));
}

function getByAuthor(req, res) {
    var author = req.params.author;
    res.json(datastore.searchAuthor(author));
}

function getAll(req, res) {
    res.json(datastore.bookData);
}

function getByKeyword(req, res) {
    //TODO Keyword search
}


module.exports.getByTitle = getByTitle;
module.exports.getByAuthor = getByAuthor;
module.exports.getByISBN = getByISBN;
module.exports.getAll = getAll;
module.exports.getByKeyword = getByKeyword;