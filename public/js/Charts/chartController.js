'use strict';

angular.module('charts.controllers.chartsController', [])
    .controller('ChartsController', ['$scope', 'ApiRoutingService', function($scope, ApiRoutingService) {
        var dc = 'NA';
        var data;

        $scope.log = function(a) {
            console.log(a);
        }

        var NAtimestampMapping = ApiRoutingService.get('impressions?dc=NA').then(function(res) {
            var ret = {},
                curr,
                timestamp;
            res.map(function(ele) {
                timestamp = ele.timestamp - ele.timestamp % 86400000
                ret[timestamp] = ret[timestamp] || {}
                curr = {
                    platform: (ret[timestamp].platform || []).concat(ele.platform),
                    format: (ret[timestamp].format || []).concat(ele.format),
                    impressions: (ret[timestamp].impressions || []).concat(ele.impressions),
                    spend: (ret[timestamp].spend || []).concat(ele.spend)
                };
                ret[timestamp] = curr
            });
            return ret;
        });

        $scope.refresh = function(xaxis, yaxis) {
            var xAxis = [];
            var yAxis = [];
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

        }
        $scope.refresh("timestamp", "spend");


    }]);