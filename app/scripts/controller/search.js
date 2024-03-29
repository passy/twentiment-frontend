(function () {
    define(['app', 'angularjsSanitize'], function (app) {
        app.controller('SearchController', ['$scope', 'twitterSearchStream',
                       'sentimentAnalyzer',
                       function ($scope, twitterSearchStream,
                                 sentimentAnalyzer) {

            var stream,
                lastQuery,
                MAX_TWEETS = 50,
                // Keep track of seen tweets
                closed = {},
                mergeTweets = function (response) {
                    _.map(response.results, function (tweet) {
                        if (!closed[tweet.id_str]) {
                            $scope.tweets.unshift(tweet);
                            closed[tweet.id_str] = 1;
                        }
                    });
                    $scope.tweets = $scope.tweets.slice(0, MAX_TWEETS);
                },
                clear = function () {
                    $scope.tweets = [];
                },
                makeStream = function () {
                    return twitterSearchStream($scope.query);
                },
                handleResponsePromise = function (promise) {
                    promise.then(function (response) {
                        if (lastQuery !== $scope.query) {
                            clear();
                            lastQuery = $scope.query;
                        }
                        mergeTweets(response);
                    });
                };

            $scope.tweets = [];
            $scope.running = false;

            $scope.$watch('query', function () {
                $scope.pause();
            });

            $scope.$watch('tweets', function (value) {
                sentimentAnalyzer.update(value);
            });

            $scope.start = function () {
                $scope.running = true;

                stream = makeStream();
                stream.start(5000, handleResponsePromise);
            };

            $scope.refresh = function () {
                makeStream().update(handleResponsePromise);
            };

            $scope.pause = function () {
                $scope.running = false;
                if (stream) {
                    stream.stop();
                }
            };
        }]);
    });
}());
