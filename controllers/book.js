/**
 * Created by Sonicdeadlock on 2/23/2016.
 */
var datastore = require('../datastore');
var _ = require('lodash');


function getByTitle(req, res) {
    var title = req.params.title;
    ;
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
    var words = req.params.keywords.split(' ');
    var course_sections = [];
    var books = [];
    words.forEach(function (word) {
        function addToCourseSections(book) {
            course_sections.push(book);
        }

        function addTobooks(book) {
            books.push(book);
        }

        datastore.searchCourseFuzzy(word).forEach(addToCourseSections);
        datastore.searchProfessorFuzzy(word).forEach(addToCourseSections);
        datastore.searchCRN(word).forEach(addToCourseSections);
        datastore.searchAuthorFuzzy(word).forEach(addTobooks);
        datastore.searchTitleFuzzy(word).forEach(addTobooks);
        if (datastore.searchISBN(word))
            addTobooks(datastore.searchISBN(word));

    });
    course_sections = _.uniq(course_sections);
    course_sections = datastore.courseFormat(course_sections);
    books = _.uniqBy(books, 'ISBN');

    res.json({course_sections: course_sections, books: books});


    //TODO Keyword search
}


module.exports.getByTitle = getByTitle;
module.exports.getByAuthor = getByAuthor;
module.exports.getByISBN = getByISBN;
module.exports.getAll = getAll;
module.exports.getByKeyword = getByKeyword;