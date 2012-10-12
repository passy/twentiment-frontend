/*globals require document */
(function () {
  'use strict';

  require.config({
    shim: {
      angularjs: {
        exports: 'angular'
      },
      underscore: {
        exports: '_'
      }
    },

  paths: {
    angularjs: '../../components/angularjs/angular',
    angularjsResource: '../../components/angularjs/angular-resource',
    underscore: '../../components/underscore/underscore'
   }
  });

  require(['angularjs', 'controller/search'], function (angular) {
    angular.bootstrap(document, ['Twentiment']);
  });
}());
