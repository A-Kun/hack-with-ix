'use strict';

angular.module('charts.controllers.chartsController', [])
    .controller('ChartsController', ['$scope', 'ApiRoutingService', function($scope, ApiRoutingService) {
        var dc = 'NA';
        var data;

        $scope.log = function(a) {
            console.log(a);
        };

        var NAtimestampMapping = ApiRoutingService.get('impressions?dc=NA').then(function(res) {
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

            NAtimestampMapping.then(function(res) {
                console.log('AAAAAAAAAAAA', res);
                if (yaxis === 'format') {
                    data = {
                        data: Object.keys(res).map(function(key) {
                            var count = res[key][yaxis].length / 2;
                            return count;
                        })
                    };
                } else { // assume yaxis is impression or spend
                    data = {
                        data: Object.keys(res).map(function(key) {
                            
                            return res[key][yaxis].reduce(function(a,b) {
                                return Math.round(a + b);
                            }, 0);
                        })
                    };
                }
                Highcharts.chart('container', {
                    chart: {
                        renderTo: 'container',
                        type: 'line'
                    },
                    xAxis: {
                        categories: Object.keys(res).map(function(key) {
                            console.log(key);
                            return new Date(parseInt(key));
                        })
                    },
                    series: [data]
                });
            });
        };
        $scope.refresh("timestamp", "spend");

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
                    if ($scope.list1.length >= 2) {
                        return false;
                    } else {
                        return true;
                    }
            }
          };
    }]);