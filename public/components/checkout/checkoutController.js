/**
 * Created by athom317 on 3/17/2016.
 */
angular.module('controllers').controller('checkoutController', function ($scope, $http, $rootScope) {
    $scope.showCheckoutStyles = true;
    $scope.billingInformation = {};
    $scope.shippingInformation = {};
    if ($rootScope.logged_in_user && $rootScope.logged_in_user.shippingInformation) {
        $scope.shippingInformation = $rootScope.logged_in_user.shippingInformation;
    }
    $scope.setCheckoutStyle = function (style) {
        $scope.checkoutStyle = style;
        $scope.showCheckoutStyles = false;
        $scope.billingInformation.paymentMethod = style;
    };
    $scope.cloneFromShipping = function () {
        $scope.billingInformation = _.merge($scope.billingInformation, _.cloneDeep($scope.shippingInformation));
    };

    $scope.checkout = function () {
        $http.post('api/cart/checkout', {
                billingInformation: $scope.billingInformation,
                shippingInformation: $scope.shippingInformation
            })
            .success(function (data) {
                $scope.receipt = data;
                //todo:navigate to landing
            }).error(function (errors) {
            //todo:show errors
        })
    }

});