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
'use strict';

angular.module('charts.chartsController', [])
	.controller('ChartsController', ['$scope', function($scope) {
						Highcharts.chart('container', {

				    xAxis: {
				        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
				            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				    },

				    series: [{
				        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
				    }]
				});
	}]);