/* globals Set: false */
'use strict';

angular.module('myApp', [
    'charts.controllers.chartsController',
    'common.services.apiRouting',
    'ngDragDrop',
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
        var dc = 'NA';
        var data;

        $scope.log = function(a) {
            console.log(a);
        };

        var NAtimestampMapping = ApiRoutingService.get('impressions?dc=' + dc).then(function(res) {
            var ret = {},
                curr,
                timestamp;
            res.map(function(ele) {
                timestamp = ele.timestamp - ele.timestamp % 86400000;
                ret[timestamp] = ret[timestamp] || {};
                curr = {
                    platform: (ret[timestamp].platform || []).concat(ele.platform),
                    format: (ret[timestamp].format || []).concat(ele.format),
                    impressions: (ret[timestamp].impressions || []).concat(ele.impressions),
                    spend: (ret[timestamp].spend || []).concat(ele.spend)
                };
                ret[timestamp] = curr;
            });
            return ret;
        });

        $scope.refresh = function(xaxis, yaxis) {
            var xAxis = [];
            var yAxis = [];
            if (xaxis == 'timestamp') {
                NAtimestampMapping.then(function(res) {
                    console.log(res);
                    Highcharts.chart('container', {
                        chart: {
                            renderTo: 'container',
                            type: 'line',
                            backgroundColor: "#000000",
                        },
                        
                        xAxis: {
                            categories: Object.keys(res).map(function(key) {
                                console.log(key);
                                return new Date(parseInt(key));
                            })
                        },
                        series: [{
                            data: Object.keys(res).map(function(key) {
                                
                                return res[key][yaxis].reduce(function(a,b) {
                                    return Math.round(a + b);
                                }, 0);
                            })
                        }]
                    });
                });
            } else if (xaxis == 'platform' || xaxis == 'format') {
                ApiRoutingService.get('impressions?dc=' + dc).then(function(res) {
                    console.log(res);
                    var i;
                    var count = {};
                    for (i = 0; i < res.length; i++) {
                        if (count[res[i][xaxis]]) {
                            count[res[i][xaxis]]++;
                        } else {
                            count[res[i][xaxis]] = 1;
                        }
                    }
                    for (var key in count) {
                        xAxis.push(key);
                        yAxis.push(count[key]);
                        console.log(count);
                    }
                    Highcharts.chart('container', {
                        chart: {
                            renderTo: 'container',
                            type: 'column',
                            backgroundColor: "#000000"//black
                        },
                        xAxis: {
                            categories: xAxis,
                            backgroundColor: "#FFFFFF" //WHITE
                        },

                        series: [{
                            data: yAxis
                        }]
                    });
                });
            } else {
                ApiRoutingService.get('impressions?dc=' + dc).then(function(res) {
                    console.log(res);
                    var i;
                    for (i = 0; i < res.length; i++) {
                        xAxis.push(res[i][xaxis]);
                        yAxis.push(res[i][yaxis]);
                    }
                    Highcharts.chart('container', {
                        chart: {
                            renderTo: 'container',
                            type: 'line',
                            backgroundColor: "#000000" //black
                        },
                        xAxis: {
                            categories: xAxis,
                            Color: "#FFFFFF" // white

                        },

                        series: [{
                            data: yAxis
                        }]
                    });
                });
            }
        }
        $scope.refresh("", "");

        $scope.list1 = [];
        $scope.list2 = [];
        $scope.list3 = [];
        $scope.list4 = [];
      
        $scope.list5 = [
            { 'title': 'Item 1', 'drag': true },
            { 'title': 'Item 2', 'drag': true },
            { 'title': 'Item 3', 'drag': true },
            { 'title': 'Item 4', 'drag': true },
            { 'title': 'Item 5', 'drag': true },
            { 'title': 'Item 6', 'drag': true },
            { 'title': 'Item 7', 'drag': true },
            { 'title': 'Item 8', 'drag': true }
        ];

        // Limit items to be dropped in list1
        $scope.optionsList1 = {
            accept: function(dragEl) {
                if ($scope.list1.length >= 2) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        $scope.list1 = [];
        $scope.list2 = [];
        $scope.list3 = [];
        $scope.list4 = [];
      
        $scope.list5 = [
            { 'title': 'Item 1', 'drag': true },
            { 'title': 'Item 2', 'drag': true },
            { 'title': 'Item 3', 'drag': true },
            { 'title': 'Item 4', 'drag': true },
            { 'title': 'Item 5', 'drag': true },
            { 'title': 'Item 6', 'drag': true },
            { 'title': 'Item 7', 'drag': true },
            { 'title': 'Item 8', 'drag': true }
        ];

      // Limit items to be dropped in list1
          $scope.optionsList1 = {
            accept: function(dragEl) {
                    return true;
            }
          };
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
