angular.module('controllers').controller('loginController', function ($scope, $http, $state, $alert, $rootScope) {
    var errors = [];
    $scope.login = function () {
        $http.post('/auth/login', {username: $scope.username, password: $scope.password}).success(function (data) {
                $rootScope.logged_in_user = data;


            })
            .error(function (data, status) {
                if (data) {
                    if (data == 'Invalid Username') {
                        $scope.invalidUsername = true;
                    }
                    else if (data == 'Invalid Password') {
                        $scope.invalidPassword = true;
                    }
                }
            })
    }
});

angular.module('directives').directive('login', function () {
    return {
        templateUrl: "components/navbar/loginDirective.html",
        controller: 'loginController',
        restrict: 'E'
    }
});
