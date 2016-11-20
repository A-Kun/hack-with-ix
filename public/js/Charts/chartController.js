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
                        delete res[max];
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
            // { title: 'x', drag: true},
            // { title: '+', drag: true},
            // { title: '-', drag: true},
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
        // Limit items to be dropped in list1
        $scope.optionsList1 = {
            accept: function(dragEl) {
                return true;
            }
        };

        $scope.refreshOnDrop = function() {
            console.log(1);
            if (isValidOperator($scope.list1) && isValidOperator($scope.list2)) {
                if ($scope.list1.length > 1 && $scope.list1[0].title == 'spend' && $scope.list1[1].title == '/' && $scope.list1[2].title == 'impressions') {
                    $scope.refresh($scope.list2[0].title, 'spendPerImpression', $scope.dc);
                } else {
                    $scope.refresh($scope.list2[0].title, $scope.list1[0].title, $scope.dc);
                }
            }
        }
    }]);