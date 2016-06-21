(function() {

    'use strict';

    angular
        .module('betApp', [
            'oc.lazyLoad',
            'ui.router',
            'satellizer',
            'ngSocket',
            'ngSanitize',
            'oitozero.ngSweetAlert'
        ])

    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false
        });
    }])

    .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, $socketProvider) {

            // Config Node server Url
            $socketProvider.setUrl('realtime.hokibet188.com:1888/' + 'member_area');

            // Config api URL
            $authProvider.loginUrl = 'api/authenticate';
            $authProvider.signupUrl = 'api/authenticate/create';
            $authProvider.baseUrl = baseUrl;
            

            // Set up loading default when 
            $httpProvider.interceptors.push(function($rootScope, $q) {

                return {

                    request: function(config) {

                        $rootScope.$broadcast('loading:show')
                        return config
                    },
                    response: function(response) {

                        $rootScope.$broadcast('loading:hide')
                        return response
                    },

                    'responseError': function(rejection) {
                        // do something on error
                        $rootScope.$broadcast('loading:hide')

                        return $q.reject(rejection);
                    }
                }
            })

            $urlRouterProvider.otherwise('/home');

            $stateProvider

            // Home routing
            .state('playtech', {
                url: '/playtech/:id',
                controller: 'PlaytechController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/playgame/playtechController.js',
                        ])
                    }]
                }

                
            })

            .state('gameplay', {
                url: '/gameplay/:id/:mode',
                controller: 'GamePlayController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/playgame/gamePlayController.js',
                        ])
                    }]
                }

                
            })

            .state('allbet', {
                url: '/allbet',
                controller: 'AllBetController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/playgame/allBetController.js',
                        ])
                    }]
                }
            })

        })
        .run(function($rootScope, $state, $socket, $http, SweetAlert) {

            // Show loading
            $rootScope.$on('loading:show', function() {
                $("#loading").show();
            })

            // Hide loading
            $rootScope.$on('loading:hide', function() {
                $("#loading").hide();
            })

        });
})();

angular.element(document).ready(function() {
    angular.bootstrap(document, ['betApp']);
});
