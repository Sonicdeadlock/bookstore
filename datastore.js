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
        bookData.push(validatDatum(obj));
    });
});

function validatDatum(datum) {
    if (_.isNull(datum.ISBN)) {
        throw "Missing ISBN\n" + JSON.stringify(datum);
    }
    if (_.isNull(datum.title)) {
        throw "Missing Title \n" + JSON.stringify(datum);
    }
    if (_.isNull(datum.author)) {
        datum.author = 'Unknown';
    }
    if (_.isNull(datum.semester)) {
        datum.semester = 'Unknown';
    }
    if (_.isNull(datum.course)) {
        datum.course = "";
    }
    if (_.isNull(datum.section)) {
        datum.section = 0;
    }
    if (_.isNull(datum.professor)) {
        datum.professor = "";
    }
    if (_.isNull(datum.CRN)) {
        datum.CRN = 0;
    }
    if (_.isNull(datum.use)) {
        datum.use = undefined;
    }
    if (!_.isFinite(Number(datum.quantityNew)) && datum.quantityNew !== 'inf') {
        datum.quantityNew = 0;
    }
    if (!_.isFinite(Number(datum.quantityUsed)) && datum.quantityUsed !== 'inf') {
        datum.quantityUsed = 0;
    }
    if (!_.isFinite(Number(datum.quantityRental)) && datum.quantityRental !== 'inf') {
        datum.quantityRental = 0;
    }
    if (!_.isFinite(Number(datum.quantityEBook)) && datum.quantityEBook !== 'inf') {
        datum.quantityEBook = 0;
    }
    if (!_.isFinite(Number(datum.priceNew))) {
        datum.priceNew = 1;
    }
    if (!_.isFinite(Number(datum.priceUsed))) {
        datum.priceUsed = 1;
    }
    if (!_.isFinite(Number(datum.priceRental))) {
        datum.priceRental = 1;
    }
    if (!_.isFinite(Number(datum.priceEBook))) {
        datum.priceEBook = 1;
    }
    if (_.isNil(datum.description)) {
        datum.description = 'No description available';
    }

    return datum;
}

module.exports = {
    searchISBN: function (ISBN) {
        return _.head(_.filter(bookData, {ISBN: ISBN}));
    },
    searchTitleFuzzy: function (titlePart) {
        return _.filter(bookData, function (book) {
            var bookTitle = book.title;
            return bookTitle.toLowerCase().indexOf(titlePart.toLowerCase()) != -1;
        });
    },
    searchTitle: function (title) {
        return _.filter(bookData, function (BD) {
            return BD.title.indexOf(title) != -1;
        });
    },
    searchAuthorFuzzy: function (authorPart) {
        return _.filter(bookData, function (book) {
            var bookAuthor = book.author;
            return bookAuthor.toLowerCase().indexOf(authorPart.toLowerCase()) != -1;
        });
    },
    searchCourseFuzzy: function (coursePart) {
        return _.filter(bookData, function (book) {
            var course = book.course;
            return course.toLowerCase().indexOf(coursePart.toLowerCase()) != -1;
        });
    },
    searchProfessorFuzzy: function (professorPart) {
        return _.filter(bookData, function (book) {
            var professor = book.professor;
            return professor.toLowerCase().indexOf(professorPart.toLowerCase()) != -1;
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
        _.forEach(_.filter(bookData, {ISBN: ISBN}), function (bkd) {
            if (bkd[field] !== 'inf') {
                bkd[field] = Number(bkd[field]) + amount;
                bkd[field] = String(bkd[field]);
                save();
            }
        });
        

    },
    bookData: bookData
};

function save() {
    var lines = [];
    var keys = _.keys(bookData[0]);
    lines.push(keys.join(config.datastore.seperator));
    _.map(bookData, function (bookDatum) {
        return _.at(bookDatum, keys).join(config.datastore.seperator);
    }).forEach(function (line) {
        lines.push(line);
    });
    fs.writeFile('books.tsv', lines.join('\n'));
}

