/* globals Set: false */
'use strict';

angular.module('myApp', [
    'charts.controllers.chartsController',
    'common.services.apiRouting',
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
'use strict';

angular.module('charts.controllers.chartsController', [])
    .controller('ChartsController', ['$scope', 'ApiRoutingService', function($scope, ApiRoutingService) {
        Highcharts.chart('container', {
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });
        $scope.log = function(a) {
            console.log(a);
        };
        ApiRoutingService.get('servers').then(function(res) {
            console.log(res);
        });


    }]);
'use strict';

angular.module('common.services.apiRouting', [])
    .service('ApiRoutingService', ['API_DOMAIN', '$http', function (API_DOMAIN, $http) {

        var API_RESOURCE_DOMAIN = API_DOMAIN + '/';

        /** Sends a PUT request with the params as the body in the request to
         * API_RESOURCE_DOMAIN/url
         * @param url {String}  The path of the route to send the API request
         * @param params {Obj}  The json object to be sent in the body of the request
         * 
         * @return {Obj} The data of the response of the request
         * Throws error if request fails
         */
        this.put = function(url, params) {
            return $http({
                method : 'PUT',
                url : API_RESOURCE_DOMAIN + url,
                headers : {'Content-Type' : 'application/json; charset=utf-8'},
                data : params
            }).then(function (ret) {
                return ret.data;
            });
        };

        /** Sends a GET request with the params as the query in the request to
         * API_RESOURCE_DOMAIN/url
         * @param url {String}  The path of the route to send the API request
         * @param params {Obj}  The json object to be sent in the query of the request
         * 
         * @return {Obj} The data of the response of the request
         * Throws error if request fails
         */
        this.get = function(url, params) {
            return $http({
                method : 'GET',
                url : API_RESOURCE_DOMAIN + url,
                headers : {'Content-Type' : 'application/json; charset=utf-8'},
                params : params
            }).then(function (ret) {
                return ret.data.data;
            });
        };

        /** Sends a DELETE request with the params as the body in the request to
         * API_RESOURCE_DOMAIN/url
         * @param url {String}  The path of the route to send the API request
         * @param params {Obj}  The json object to be sent in the body of the request
         * 
         * @return {Obj} The data of the response of the request
         * Throws error if request fails
         */
        this.delete = function(url, params) {
            return $http({
                method : 'DELETE',
                url : API_RESOURCE_DOMAIN + url,
                headers : {'Content-Type' : 'application/json; charset=utf-8'},
                data : params
            }).then(function (ret) {
                return ret.data.data;
            });
        };

        /** Sends a PATCH request with the params as the body in the request to
         * API_RESOURCE_DOMAIN/url
         * @param url {String}  The path of the route to send the API request
         * @param params {Obj}  The json object to be sent in the body of the request
         * 
         * @return {Obj} The data of the response of the request
         * Throws error if request fails
         */
        this.patch = function(url, params) {
            return $http({
                method : 'PATCH',
                url : API_RESOURCE_DOMAIN + url,
                headers : {'Content-Type' : 'application/json; charset=utf-8'},
                data : params
            }).then(function (ret) {
                return ret.data.data;
            });
        };
    }]);
