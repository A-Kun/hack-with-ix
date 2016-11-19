/* globals Set: false */
'use strict';

angular.module('myApp', [
    'charts.chartsController',
    'ngRoute'
    ])
    .config(['$provide', '$routeProvider', '$locationProvider', '$sceDelegateProvider',
        function ($provide, $routeProvider, $locationProvider, $sceDelegateProvider) {
            $provide.constant('API_DOMAIN', apiDomain);
            $routeProvider
                .when('/hello/', {
                    templateUrl : '/bye'
                });
            $locationProvider.html5Mode(true);

            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'localhost:8000**',
                'http://localhost:8000**',
                '126.0.0.1:8000**',
                'localhost:3000**',
                'http://localhost:3000**',
                '126.0.0.1:3000**'
            ]);

            $sceDelegateProvider.resourceUrlBlacklist([]);
    }]);