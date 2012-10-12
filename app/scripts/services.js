/*global define*/
(function () {
    'use strict';

    define(['angularjs', 'underscore', 'angularjsResource'], function (angular, _) {
        angular.module('Twitter', ['ngResource'])
            .factory('twitterSearch', ['$resource', function ($resource) {
                return $resource('http://search.twitter.com/search.json', {
                    callback: 'JSON_CALLBACK'
                }, {
                    get: {method: 'JSONP'}
                });
            }])

            .factory('twitterSearchResultFormatter', function () {
                return {
                    format: function (data) {
                        return _.map(data, function (result) {
                            result.date = Date.parse(result.created_at);
                            return result;
                        });
                    }
                };
            })

            .factory('twitterSearchStream', [
                     '$q', 'twitterSearch', 'twitterSearchResultFormatter',
                     function ($q, twitterSearch, formatter) {
                return function (query) {
                    var state = {lastId: 0};

                    return {
                        update: function () {
                            var result,
                                deferred = $q.defer();

                            result = twitterSearch.get({
                                q: query,
                                since_id: state.lastId
                            }, function () {
                                result.results = formatter.format(result.results);

                                if (result.results && result.results.length) {
                                    state.lastId = result.results[0].id_str;
                                }
                                deferred.resolve(result);
                            });

                            return deferred.promise;
                        }
                    };
                };
            }]);
    });
}());
