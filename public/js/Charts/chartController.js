'use strict';

angular.module('charts.controllers.chartsController', [])
    .controller('ChartsController', ['$scope', 'ApiRoutingService', function($scope, ApiRoutingService) {
        var dc = 'NA';
        var data;

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

        $scope.changeServer = function(server) {
            dc = server;
            $scope.refreshOnDrop();
        }

        $scope.refresh = function(xaxis, yaxis, dc) {
            var xAxis = [];
            var yAxis = [];
            if (xaxis == 'timestamp') {
                if (yaxis == 'spendPerImpression') {
                    NAtimestampMapping.then(function(res) {
                        var max = 0;
                        for (var key in res) {
                            if (key > max) {
                                max = key;
                            } 
                        }
                        delete res[max]; // Remove the last timestamp, whose data is incomplete
                        for (var key in res) {
                            res[key]['spendPerImpression'] = [];
                            var i;
                            for (i = 0; i < res[key]['spend'].length; i++) {
                                res[key]['spendPerImpression'].push(res[key]['spend'][i] / res[key]['impressions'][i])
                            }
                        }
                        Highcharts.chart('container', {
                            title:{
                                text:''
                            },
                            chart: {
                                renderTo: 'container',
                                type: 'line'
                            },
                            xAxis: {
                                categories: Object.keys(res).map(function(key) {
                                    return new Date(parseInt(key));
                                })
                            },
                            series: [{
                                data: Object.keys(res).map(function(key) {
                                    
                                    return res[key]['spendPerImpression'].reduce(function(a,b) {
                                        return Math.round(a + b);
                                    }, 0);
                                })
                            }]
                        });
                        showStats(Object.keys(res).map(function(key) {
                                    
                                    return res[key]['spendPerImpression'].reduce(function(a,b) {
                                        return Math.round(a + b);
                                    }, 0)}));
                    });
                } else {
                    NAtimestampMapping.then(function(res) {
                        var max = 0;
                        for (var key in res) {
                            if (key > max) {
                                max = key;
                            } 
                        }
                        delete res[max];
                        Highcharts.chart('container', {
                            title:{
                                text:''
                            },
                            chart: {
                                renderTo: 'container',
                                type: 'line'
                            },
                            xAxis: {
                                categories: Object.keys(res).map(function(key) {
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
            } else if ((xaxis == 'platform' || xaxis == 'format') && yaxis == 'count') {
                ApiRoutingService.get('impressions?dc=' + dc).then(function(res) {
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
                    }
                    Highcharts.chart('container', {
                        title:{
                            text:''
                        },
                        chart: {
                            renderTo: 'container',
                            type: 'column',
                        },
                        xAxis: {
                            categories: xAxis,
                        },

                        series: [{
                            data: yAxis
                        }]
                    });
                });
            } else {
                ApiRoutingService.get('impressions?dc=' + dc).then(function(res) {
                    var i;
                    for (i = 0; i < res.length; i++) {
                        xAxis.push(res[i][xaxis]);
                        yAxis.push(res[i][yaxis]);
                    }
                    Highcharts.chart('container', {
                        title:{
                            text:''
                        },
                        chart: {
                            renderTo: 'container',
                            type: 'line',
                        },
                        xAxis: {
                            categories: xAxis,

                        },
                        series: [{
                            data: yAxis
                        }]
                    });
                });
            }
        }
        $scope.refresh('', '', dc);

        $scope.list1 = [];
        $scope.list2 = [];
        $scope.list5 = [
            { title: 'timestamp', drag: true },
            { title: 'platform', drag: true },
            { title: 'format', drag: true },
            { title: 'impressions', drag: true },
            { title: 'spend', drag: true },
            { title: 'count', drag: true},
            { title: '/', drag: true}
        ];
        function isValidOperator(listA) {
            if (!listA.length || (!(listA.length % 2))) {
                return false;
            }
            if (listA.length === 1) {
                return true;
            }
            for (var i = 0; i < listA.length; i++) {
                if (!(i % 2) && (['x', '+', '-', '/'].indexOf(listA[i].title) != -1)) {
                    return false;
                } else if ((i % 2) && (!(['x', '+', '-', '/'].indexOf(listA[i].title) != -1))) {
                    return false; 
                }
            }
            return true;
        }

        // 5-number summary, standard deviation and outliers
        function showStats(dataArray) {
            var values = dataArray.slice();
            values.sort(function(a, b) { return a - b;} );
            var min = values[0];
            var q1 = values[Math.floor(values.length / 4)];
            var median = values[Math.floor(values.length / 2)];
            var q3 = values[Math.floor(3 * values.length / 4)];
            var max = values[values.length - 1];
            
            // midspread or middle 50%
            var interquartile = q3 - q1;
            // caculate boudaries
            var lower_boundary = q1 - (1.5 * interquartile);
            var upper_boundary = q3 - (1.5 * interquartile);

            var mean = values.reduce(function(a, b) {return a + b;}) / values.length;

            var difference_sum = 0;
            for (var i = 0; i < values.length; i++) {
                difference_sum += Math.pow(values[i] - mean, 2);
            }
            var standard_deviation = Math.sqrt(difference_sum / values.length);
            var result = {
                min: min,
                q1: q1,
                median: median,
                q3: q3,
                max: max,
                interquartile: interquartile,
                lower_boundary: lower_boundary,
                upper_boundary: upper_boundary,
                standard_deviation: standard_deviation
            };
            return reulst;
        }

        // Limit items to be dropped in list1
        $scope.optionsList1 = {
            accept: function(dragEl) {
                return true;
            }
        };

        $scope.refreshOnDrop = function() {
            if (isValidOperator($scope.list1) && isValidOperator($scope.list2)) {
                if ($scope.list1.length > 1 && $scope.list1[0].title == 'spend' && $scope.list1[1].title == '/' && $scope.list1[2].title == 'impressions') {
                    $scope.refresh($scope.list2[0].title, 'spendPerImpression', $scope.dc);
                } else {
                    $scope.refresh($scope.list2[0].title, $scope.list1[0].title, $scope.dc);
                }
            }
        }

        $scope.dc = 'NA';
    }]);