/**
 * Created by Sonicdeadlock on 3/2/2016.
 */
angular.module('controllers').controller('searchController', function ($scope, $http, $rootScope) {
    var searchType = $rootScope.$stateParams.searchType;
    var searchString = $rootScope.$stateParams.searchString;
    $scope.books = [];
    $scope.course_sections = [];
    switch (searchType) {
        case 'Title':
            $http.get('/api/books/title/' + searchString)
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'Author':
            $http.get('/api/books/author/' + searchString)
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'ISBN':
            $http.get('/api/books/ISBN/' + searchString)
                .success(function (data) {
                    $scope.books = data;
                });
            break;
        case 'Course':
            $http.get('/api/courses/get_books/' + searchString)
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
            $http.get('/api/professors/get_books/' + searchString)
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
            $http.get('/api/books/keyword/' + searchString)
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

    $scope.add = function (book_id, order_type) {
        $http.post('/api/cart/add', {ITEM_BOOK_ID: book_id, PURCHASE_TYPE: order_type}).success(function () {
            $http.get('/api/cart/count').success(function (data) {
                $rootScope.cart_count = data;
            })
        })
    };

    $scope.addAll = function (course_section) {
        course_section.required_books.forEach(function (book) {
            $scope.add(book.BOOK_ID, 'NEW')
        });
        course_section.recommended_books.forEach(function (book) {
            $scope.add(book.BOOK_ID, 'NEW')
        });
    };
});
