/**
 * Created by athom317 on 3/17/2016.
 */
angular.module('controllers').controller('checkoutController', function ($scope, $http, $rootScope, $alert) {
    $scope.showCheckoutStyles = true;
    $scope.billingInformation = {};
    $scope.shippingInformation = {};
    var alerts = [];
    if ($rootScope.logged_in_user && $rootScope.logged_in_user.shippingInformation) {
        $scope.shippingInformation = $rootScope.logged_in_user.shippingInformation;
    }
    $rootScope.$watch('logged_in_user', function () {
        if ($rootScope.logged_in_user && $rootScope.logged_in_user.shippingInformation)
        $scope.shippingInformation = $rootScope.logged_in_user.shippingInformation;
    });
    $scope.setCheckoutStyle = function (style) {
        $scope.checkoutStyle = style;
        $scope.showCheckoutStyles = false;
        $scope.billingInformation.paymentMethod = style;
    };
    $scope.cloneFromShipping = function () {
        $scope.billingInformation = _.merge($scope.billingInformation, _.cloneDeep($scope.shippingInformation));
    };

    $scope.checkout = function () {
        $http.get('/api/cart').success(function (data) {
            if (data && data != [])
                $http.post('api/cart/checkout', {
                        billingInformation: $scope.billingInformation,
                        shippingInformation: $scope.shippingInformation
                    })
                    .success(function (data) {
                        $scope.receipt = data;
                        _.forEach(alerts, function (alert) {
                            alert.destroy();
                        });
                        alerts = [];
                    }).error(function (errors) {
                    var alert = $alert({content: errors, placement: 'top', show: true, type: 'danger'});
                    alerts.push(alert);
                    setTimeout(function () {
                    alert.destroy();
                    }, 1000 * 6)
                });
            else {
                var alert = $alert({content: 'No Items in cart', placement: 'top', show: true, type: 'danger'});
                alerts.push(alert);
                setTimeout(function () {
                    alert.destroy();
                }, 1000 * 6)
            }

        });

    }

}).filter('last4', function () {
    return function (input) {
        return _.takeRight(input.trim(), 4).join('');
    }
});