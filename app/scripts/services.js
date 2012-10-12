/*global define*/
(function () {
    'use strict';

    define(['angularjs', 'angularjsResource'], function (angular) {
        angular.module('Twitter', ['ngResource'])
            .factory('twitterSearch', ['$resource', function ($resource) {
                return $resource('http://search.twitter.com/search.json', {
                    callback: 'JSON_CALLBACK'
                }, {
                    get: {method: 'JSONP'}
                });
            }]);
    });
}());
