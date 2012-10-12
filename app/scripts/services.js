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
                     '$q', '$timeout', 'twitterSearch',
                     'twitterSearchResultFormatter',
                     function ($q, $timeout, twitterSearch, formatter) {
                return function (query) {
                    var state = {
                        lastId: 0,
                        timeout: null,
                        autoUpdate: false,
                        interval: 1500
                    };

                    return {
                        update: function (callback) {
                            var result,
                                that = this,
                                deferred = $q.defer();

                            result = twitterSearch.get({
                                q: query,
                                since_id: state.lastId
                            }, function () {
                                result.results = formatter.format(result.results);

                                if (result.results && result.results.length) {
                                    state.lastId = result.max_id;
                                }
                                deferred.resolve(result);
                            });

                            if (state.autoUpdate) {
                                state.timeout = $timeout(function () {
                                    that.update(callback);
                                }, state.interval);
                            }

                            if (callback) {
                                callback(deferred.promise);
                            }

                            return deferred.promise;
                        },

                        start: function (interval, callback) {
                            if (interval) {
                                state.interval = interval;
                            }

                            this.stop();
                            state.autoUpdate = true;
                            return this.update(callback);
                        },

                        stop: function () {
                            // Gosh, being single-threaded can be so nice!
                            if (state.timeout) {
                                $timeout.cancel(state.timeout);
                                state.timeout = null;
                            }
                            state.autoUpdate = false;
                        }
                    };
                };
            }]);
    });
}());
