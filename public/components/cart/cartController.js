/**
 * Created by Sonicdeadlock on 3/8/2016.
 */
angular.module('controllers').controller('cartController', function ($scope, $http, $rootScope, $state) {
    $scope.cart_items = [];
    $scope.type_dropdown = [
        {text: "New", click: "change_purchase_type(item,'NEW')"},
        {text: "Used", click: "change_purchase_type(item,'USED')"},
        {text: "E-Book", click: "change_purchase_type(item,'EBOOK')"},
        {text: "Rent", click: "change_purchase_type(item,'RENT')"}
    ];
    function update_cart() {
        $http.get('/api/cart/count').success(function (data) {
            $rootScope.cart_count = data;
        });
        $http.get('/api/cart').success(function (data) {

            $scope.cart_items = data;
        });
    }

    update_cart();
    $scope.getQuantity = function (item) {
        var quantity = 0;

        switch (item.purchaseType) {
            case 'RENT':
                quantity = item.quantityRental;
                break;
            case "NEW":
                quantity = item.quantityNew;
                break;
            case "USED":
                quantity = item.quantityUsed;
                break;
        }
        if (quantity === 'inf')
            quantity = 10;
        var quantities = [];

        for (var i = 0; i <= quantity; i++) {
            quantities.push(i);
        }
        return quantities;
    };

    $scope.change_purchase_type = function (item, new_type) {
        item.purchaseType = new_type;
        $http.put('/api/cart', item).success(function (data) {
            update_cart();
        })
    };
    $scope.change_quantity = function (item, new_quantity) {

        item.quantity = new_quantity;
        $http.put('/api/cart', item).success(function (data) {
            update_cart();
        })
    };

    $scope.remove = function (item) {
        $http.delete('/api/cart/delete/' + item.id).success(function (data) {
            update_cart();
        });
    };
    $scope.getPrice = function (item) {
        switch (item.purchaseType) {
            case 'RENT':
                return item.priceRental;
            case "NEW":
                return item.priceNew;
            case "USED":
                return item.priceUsed;
            case "EBOOK":
                return item.priceEBook;
        }
    };

    $scope.getTotal = function () {
        var sum = 0;
        $scope.cart_items.forEach(function (item) {
            sum += $scope.getPrice(item) * item.quantity;
        });
        return sum;
    };
    $scope.checkout = function () {
        $http.get('/api/cart/checkout').success(function () {
            $http.get('/api/cart/count').success(function (data) {
                $rootScope.cart_count = data;
                $state.go("home");
            })

        })
    }
}).filter('capitalize', function () {
    return function (item) {
        return _.capitalize(item);
    }
});