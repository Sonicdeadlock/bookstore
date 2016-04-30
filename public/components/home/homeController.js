/**
 * Created by alexthomas on 1/19/16.
 */
angular.module('controllers').controller('homeController', function ($scope, $http, $state) {
    $http.get('/api/books/getAll')
        .success(function (data) {
            $scope.allBooks = data;
            $scope.bookSample = _.sampleSize(data, 3);

        });
});