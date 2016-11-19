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
