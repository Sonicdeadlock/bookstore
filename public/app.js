/**
 * Created by Sonicdeadlock on 3/1/2016.
 */
'use strict';

var app = angular.module('userApp', [
    'ngResource',
    'ui.router',
    'controllers',
    'services',
    'directives'

]);

app.run(['$rootScope', '$state', '$stateParams', '$http', function ($rootScope, $state, $stateParams, $http) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));

    //Save a copy of the parameters so we can access them from all the controllers
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $http.get('/api/cart/count').success(function (data) {
        $rootScope.cart_count = data;
    });
    $http.get('/auth/self').success(function (data) {
        $rootScope.logged_in_user = data;
    })
}]);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                navbar: {
                    templateUrl: "components/navbar/navbarView.html",
                    controller: "navbarController"
                },
                searchBar: {
                    templateUrl: "components/searchBar/searchBarView.html",
                    controller: "searchBarController"
                },
                content: {
                    templateUrl: "components/home/homeView.html",
                    controller: "homeController"
                }
            }
        }).state('search', {
        url: "/search?searchType&searchString",
        views: {
            navbar: {
                templateUrl: "components/navbar/navbarView.html",
                controller: "navbarController"
            },
            searchBar: {
                templateUrl: "components/searchBar/searchBarView.html",
                controller: "searchBarController"
            },
            content: {
                templateUrl: "components/search/searchView.html",
                controller: "searchController"
            }
        }
    }).state('book', {
        url: "/book/:bookId",
        views: {
            navbar: {
                templateUrl: "components/navbar/navbarView.html",
                controller: "navbarController"
            },
            searchBar: {
                templateUrl: "components/searchBar/searchBarView.html",
                controller: "searchBarController"
            },
            content: {
                templateUrl: "components/book/bookView.html",
                controller: "bookController"
            }
        }
    }).state('cart', {
        url: '/cart',
        views: {
            navbar: {
                templateUrl: "components/navbar/navbarView.html",
                controller: "navbarController"
            },
            content: {
                templateUrl: "components/cart/cartView.html",
                controller: "cartController"
            }
        }
    }).state('checkout', {
        url: '/checkout',
        views: {
            navbar: {
                templateUrl: "components/navbar/navbarView.html",
                controller: "navbarController"
            },
            content: {
                templateUrl: "components/checkout/checkoutView.html",
                controller: "checkoutController"
            }
        }
    })


}]);

angular.module('controllers', ['ngAnimate', 'mgcrea.ngStrap']);
angular.module('directives', ['ngAnimate', 'mgcrea.ngStrap']);
angular.module('services', []);