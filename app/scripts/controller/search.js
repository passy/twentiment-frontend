(function () {
    define(['app'], function (app) {
        app.controller('SearchController', ['$scope', 'twitterSearchStream',
                       function ($scope, twitterSearchStream) {

            var stream = twitterSearchStream("obama").update();

            stream.then(function (response) {
                $scope.tweets = response.results;
                console.log("Tweets:", response);
            });
        }]);
    });
}());
