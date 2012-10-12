/*globals require document */
(function () {
  'use strict';

  require.config({
    shim: {
      AngularJS: {
        exports: 'angular'
      },
      underscore: {
        exports: '_'
      }
    },

  paths: {
    AngularJS: '../../components/AngularJS/angular',
    underscore: '../../components/underscore/underscore'
   }
  });

  require(['AngularJS', 'controller/search'], function (angular) {
    angular.bootstrap(document, ['twentiment']);
  });
}());
