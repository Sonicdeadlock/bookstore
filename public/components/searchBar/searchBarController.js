/**
 * Created by Sonicdeadlock on 3/2/2016.
 */
angular.module('controllers').controller('searchBarController', function ($scope, $http, $rootScope) {
    $scope.searchOptions = ['Title', 'Author', 'ISBN', 'Course', 'Professor', 'Keyword'];
    $scope.searchType = $rootScope.$stateParams.searchType || 'Title';
    $scope.search = $rootScope.$stateParams.searchString;

    $scope.typeaheadList = [];
    var allBooks = [];
    var professors = [];
    var courses = [];
    $http.get('/api/books/getAll')
        .success(function (data) {
            allBooks = data;
            updateTypeaheadList();
        });
    $http.get('/api/professors')
        .success(function (data) {
            professors = data;
            updateTypeaheadList();
        });
    $http.get('/api/courses')
        .success(function (data) {
            courses = data;
            updateTypeaheadList();
        });
    $scope.$watch('searchType', function (newValue, oldValue) {
        updateTypeaheadList();
    });
    function updateTypeaheadList() {
        switch ($scope.searchType) {
            case 'Title':
                $scope.typeaheadList = _.uniq(_.map(allBooks, 'title'));
                break;
            case 'Author':
                $scope.typeaheadList = _.uniq(_.map(allBooks, 'author'));
                break;
            case 'ISBN':
                $scope.typeaheadList = _.map(allBooks, 'ISBN');
                break;
            case 'Course':
                $scope.typeaheadList = courses;
                break;
            case 'Professor':
                $scope.typeaheadList = professors;
                break;
            case 'Keyword':
                $scope.typeaheadList = [];
                break;

        }
        console.log($scope.typeaheadList)

    }
});
