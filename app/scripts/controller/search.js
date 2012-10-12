(function () {
    define(['app', 'angularjsSanitize'], function (app) {
        app.controller('SearchController', ['$scope', 'twitterSearchStream',
                       function ($scope, twitterSearchStream) {

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
                };

            $scope.tweets = [];
            $scope.running = false;

            $scope.$watch('query', function () {
                $scope.pause();
            });


            $scope.start = function () {
                $scope.running = true;

                if (lastQuery !== $scope.query) {
                    clear();
                }

                lastQuery = $scope.query;
                stream = twitterSearchStream($scope.query);
                stream.start(5000, function (promise) {
                    promise.then(function (response) {
                        mergeTweets(response);
                    });
                });
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
