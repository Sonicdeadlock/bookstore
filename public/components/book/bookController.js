/**
 * Created by Sonicdeadlock on 3/2/2016.
 */
angular.module('controllers').controller('bookController', function ($scope, $http, $rootScope) {
    var bookId = $rootScope.$stateParams.bookId;
    $scope.book = {};
    $http.get('/api/books/ISBN/' + bookId)
        .success(function (data) {
            $scope.book = data;
        });
    $scope.add = function (order_type) {
        $scope.book.purchaseType = order_type;
        $http.post('/api/cart/add', $scope.book).success(function () {
            $http.get('/api/cart/count').success(function (data) {
                $rootScope.cart_count = data;
            })
        })
    }
});