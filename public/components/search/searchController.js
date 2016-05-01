/**
 * Created by Sonicdeadlock on 3/2/2016.
 */
angular.module('controllers').controller('searchController', function ($scope, $http, $rootScope) {
    var searchType = $rootScope.$stateParams.searchType;
    var searchString = $rootScope.$stateParams.searchString;
    $scope.books = [];
    $scope.course_sections = [];
    $scope.showRecommended = true;
    $scope.showRequired = true;
    $scope.searchType = searchType;
    $scope.sortPredicate = 'title';
    $scope.sortReverse = false;
    $scope.sortPrice = false;
    $scope.priceTypes = [
        {key: 'priceNew', text: 'New Book'},
        {key: 'priceUsed', text: 'Used Book'},
        {key: 'priceRental', text: 'Rental Book'},
        {key: 'priceEBook', text: 'EBook Book'}
    ];

    $scope.sortBooks = function (sort) {
        if (sort === 'price') {
            $scope.sortPredicate = 'priceNew';
            $scope.sortPrice = true;
        }
        else {
            $scope.sortPredicate = sort;
            $scope.sortPrice = false;
            $scope.sortReverse = false;
        }
    };
    switch (searchType) {
        case 'Title':
            $http.post('/api/books/title/', {title: searchString})
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'Author':
            $http.post('/api/books/author/', {author: searchString})
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'ISBN':
            $http.post('/api/books/ISBN/', {ISBN: searchString})
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'Course':
            $http.post('/api/courses/get_books/', {course: searchString})
                .success(function (data) {
                    $scope.course_sections = _.map(data, function (course) {
                        return {
                            course: course[0].course,
                            section: course[0].section,
                            CRN: course[0].CRN,
                            required: _.filter(course, {use: 'Required'}),
                            recommended: _.filter(course, {use: 'Recommended'})
                        }
                    })
                });
            break;
        case 'Professor':
            $http.post('/api/professors/get_books/', {professor: searchString})
                .success(function (data) {
                    $scope.course_sections = _.map(data, function (course) {
                        return {
                            course: course[0].course,
                            section: course[0].section,
                            CRN: course[0].CRN,
                            required: _.filter(course, {use: 'Required'}),
                            recommended: _.filter(course, {use: 'Recommended'})
                        }
                    })
                });
            break;
        case 'Keyword':
            $http.post('/api/books/keyword/', {keywords: searchString})
                .success(function (data) {
                    $scope.books = data.books;
                    $scope.course_sections = _.map(data.course_sections, function (course) {
                        return {
                            course: course[0].course,
                            section: course[0].section,
                            CRN: course[0].CRN,
                            required: _.filter(course, {use: 'Required'}),
                            recommended: _.filter(course, {use: 'Recommended'})
                        }
                    });
                });
            break;
    }

    $scope.add = function (book, order_type) {
        book.purchaseType = order_type;
        $http.post('/api/cart/add', book).success(function () {
            $http.get('/api/cart/count').success(function (data) {
                $rootScope.cart_count = data;
            })
        })
    };

    $scope.addAll = function (course_section) {
        course_section.required.forEach(function (book) {
            $scope.add(book, 'NEW')
        });
        course_section.recommended.forEach(function (book) {
            $scope.add(book, 'NEW')
        });
    };
});
