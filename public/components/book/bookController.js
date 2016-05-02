/**
 * Created by Sonicdeadlock on 3/2/2016.
 */
angular.module('controllers').controller('bookController', function ($scope, $http, $rootScope, $alert) {
    var bookId = $rootScope.$stateParams.bookId;
    $scope.book = {};
    $http.get('/api/books/ISBN/' + bookId)
        .success(function (data) {
            $scope.book = data;
        });
    $scope.add = function (order_type) {
        switch (order_type) {
            case 'RENT':
                if ($scope.book.quantityRental <= 0)
                    return;
                break;
            case "NEW":
                if ($scope.book.quantityNew <= 0)
                    return;
                break;
            case "USED":
                if ($scope.book.quantityUsed <= 0)
                    return;
                break;
            case "EBOOK":
                if ($scope.book.quantityEBook <= 0)
                    return;
                break;
        }
        $scope.book.purchaseType = order_type;
        $http.post('/api/cart/add', $scope.book).success(function () {
            var alert = $alert({content: 'Book Added to cart', placement: 'top-right', show: true, type: 'info'});
            setTimeout(function () {
                alert.destroy();
            }, 1000 * 2);
            $http.get('/api/cart/count').success(function (data) {
                $rootScope.cart_count = data;
            })
        })
    }
});