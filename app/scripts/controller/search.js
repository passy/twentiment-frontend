(function () {
    define(['app', 'angularjsSanitize'], function (app) {
        app.controller('SearchController', ['$scope', 'twitterSearchStream',
                       function ($scope, twitterSearchStream) {


            var stream = twitterSearchStream(":)"),
                mergeTweets = function (response) {
                    _.map(response.results, function (tweet) {
                        $scope.tweets.unshift(tweet);
                    });
                };

            $scope.tweets = [];

            stream.start(5000, function (promise) {
                promise.then(function (response) {
                    mergeTweets(response);
                });
            });
        }]);
    });
}());
