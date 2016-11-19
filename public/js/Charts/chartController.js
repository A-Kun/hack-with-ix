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
                            type: 'line'
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
                            type: 'column'
                        },
                        xAxis: {
                            categories: xAxis
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
                            type: 'line'
                        },
                        xAxis: {
                            categories: xAxis
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
                    if ($scope.list1.length >= 2) {
                        return false;
                    } else {
                        return true;
                    }
            }
          };
    }]);