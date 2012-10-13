/*global define*/

(function () {
    define(['app'], function(app) {
        app.filter('score', function () {
            return function (value) {
                if (value === undefined) {
                    return "";
                }

                return Math.round(value * 100) / 100;
            };
        });
    });
}());
