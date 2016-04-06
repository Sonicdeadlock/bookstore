/**
 * Created by alexthomas on 4/5/16.
 */
var config = require('./config');
var fs = require('fs');
var _ = require('lodash');

var bookData = [];

fs.readFile(config.datastore.path, 'utf8', function (err, data) {
    var lines = data.split('\n');
    lines = _.map(lines, function (line) {
        return _.trim(line, '\r')
    });
    var tokens = lines[0].split(config.datastore.seperator);
    _.slice(lines, 1).forEach(function (line) {
        var columns = line.split(config.datastore.seperator);
        var obj = {};
        for (var i = 0; i < columns.length; i++) {
            obj[tokens[i]] = columns[i];
        }
        bookData.push(obj);
    });
});

module.exports = {
    searchISBN: function (ISBN) {
        return _.head(_.filter(bookData, {ISBN: ISBN}));
    },
    searchTitleFuzzy: function (titlePart) {
        return _.filter(bookData, function (book) {
            var bookTitle = book.title;
            return _.lowerCase(bookTitle).indexOf(_.lowerCase(titlePart)) != -1;
        });
    },
    searchTitle: function (title) {
        return _.filter(bookData, {title: title});
    },
    searchAuthorFuzzy: function (authorPart) {
        return _.filter(bookData, function (book) {
            var bookAuthor = book.author;
            return _.lowerCase(bookAuthor).indexOf(_.lowerCase(authorPart)) != -1;
        });
    },
    searchAuthor: function (author) {
        return _.filter(bookData, {author: author});
    },
    searchCourse: function (course, section) {
        if (section) {
            return _.filter(bookData, {course: course, section: section});
        }
        else
            return _.filter(bookData, {course: course})
    },
    searchProfessor: function (professor) {
        return _.filter(bookData, {professor: professor});
    },
    searchCRN: function (CRN) {
        return _.filter(bookData, {CRN: CRN});
    },
    getTitles: function () {
        return _.chain(bookData)
            .map('title')
            .uniq()
            .value();
    },
    getAuthors: function () {
        return _.chain(bookData)
            .map('author')
            .uniq()
            .value();
    },
    getProfessors: function () {
        return _.chain(bookData)
            .map('professor')
            .uniq()
            .value();
    },
    getCourseSections: function () {
        return _.chain(bookData)
            .map(function (bookDatum) {
                return {
                    course: bookDatum.course,
                    section: bookDatum.section,
                    CRN: bookDatum.CRN
                }
            })
            .uniq()
            .value();
    },
    getCourses: function () {
        return _.chain(bookData)
            .map('course')
            .uniq()
            .value();
    },
    courseFormat: function (dataSet) {
        return _.chain(dataSet)
            .groupBy('CRN')
            .values()
            .map(_.uniq)
            .value();
    },
    save: function () {
        var lines = [];
        var keys = _.keys(bookData[0]);
        lines.push(keys.join(config.datastore.seperator));
        _.map(bookData, function (bookDatum) {
            return _.at(bookDatum, keys).join(config.datastore.seperator);
        }).forEach(function (line) {
            lines.push(line);
        });
        fs.writeFile('books.tsv', lines.join('\n'));
    },
    increment: function (ISBN, amount, field) {
        this.searchISBN(ISBN)[field] = Number(this.searchISBN(ISBN)[field]) + amount;
        this.save();
    },
    bookData: bookData
};

