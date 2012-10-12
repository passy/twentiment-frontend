(function () {
    define(['app'], function (app) {
        app.controller('SearchController', ['$scope', 'twitterSearch',
                       function ($scope, twitterSearch) {

            $scope.hello = "World";
        }]);
    });
}());
