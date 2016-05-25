(function() {

    'use strict';

    angular
        .module('betApp', [
            'pascalprecht.translate',
            'oc.lazyLoad',
            'ui.router',
            'satellizer',
            'ngDialog',
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

    .config(function($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            files: [{
                prefix: '/language/header-',
                suffix: '.json'
            }, {
                prefix: '/language/home-',
                suffix: '.json'
            }, {
                prefix: '/language/signup-',
                suffix: '.json'
            }, {
                prefix: '/language/transaction-',
                suffix: '.json'
            }, {
                prefix: '/language/term-',
                suffix: '.json'
            }, {
                prefix: '/language/policy-',
                suffix: '.json'
            }, {
                prefix: '/language/gambling-',
                suffix: '.json'
            }]
        });

        $translateProvider.preferredLanguage('in');

        $translateProvider.useSanitizeValueStrategy('escapeParameters');
    })

    .config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, $socketProvider) {

            // Config Node server Url
            $socketProvider.setUrl('realtime.hokibet188.com:1888/' + 'member_area');

            // Config api URL
            $authProvider.loginUrl = 'api/authenticate';
            $authProvider.signupUrl = 'api/authenticate/create';
            $authProvider.baseUrl = baseUrl;

            // Push the new factory onto the $http interceptor array
            $httpProvider.interceptors.push(function redirectWhenLoggedOut($q, $injector) {

                return {

                    responseError: function(rejection) {

                        var $state = $injector.get('$state');
                        var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                        angular.forEach(rejectionReasons, function(value, key) {

                            if (rejection.data.error === value) {

                                localStorage.removeItem('user');
                                localStorage.removeItem('satellizer_token');
                                $rootScope.authenticated = false;
                                $rootScope.currentUser = null;
                                $state.go('home');
                            }
                        });

                        return $q.reject(rejection);
                    }
                }
            });

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
                .state('home', {
                url: '/home',
                templateUrl: '/templates/page/home.html',
                controller: 'HomeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/homeController.js',
                            '/js/app/directive/hokibetSlide.js'
                        ])
                    }]
                }
            })

            // Register routing
            .state('register', {
                url: '/register',
                templateUrl: '/templates/page/register.html',
                controller: 'RegisterController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/registerController.js'
                        ])
                    }]
                }
            })

            // Deposit routing
            .state('deposit', {
                url: '/deposit',
                templateUrl: '/templates/page/transaction/deposit.html',
                controller: 'DepositController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/transaction/depositController.js',
                            '/js/app/directive/creditInfo.js'
                        ])
                    }]
                }
            })

            // Withdraw routing
            .state('withdraw', {
                url: '/withdraw',
                templateUrl: '/templates/page/transaction/withdraw.html',
                controller: 'WithdrawController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/transaction/withdrawController.js',
                            '/js/app/directive/creditInfo.js'
                        ])
                    }]
                }
            })

            // Transfer routing
            .state('transfer', {
                url: '/transfer',
                templateUrl: '/templates/page/transaction/transfer.html',
                controller: 'TransferController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/transaction/transferController.js',
                            '/js/app/directive/creditInfo.js'
                        ])
                    }]
                }
            })

            // Profile routing
            .state('profile', {
                url: '/profile',
                templateUrl: '/templates/page/profile.html',
                controller: 'ProfileController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/profileController.js'
                        ])
                    }]
                }
            })

            // Deposit report route
            .state('depositReport', {
                url: '/report/deposit',
                templateUrl: '/templates/page/report/deposit.html',
                controller: 'DepositReportController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/report/depositReportController.js',
                            '/bower_components/angularjs-datepicker/src/js/angular-datepicker.js',
                            '/bower_components/angularjs-datepicker/src/css/angular-datepicker.css',
                            '/js/app/service/DateTimeModule.js',
                            '/js/app/service/ExcelModule.js',
                            '/bower_components/angular-utils-pagination/dirPagination.js'
                        ])
                    }]
                }
            })

            // Withdrawn report route
            .state('withdrawnReport', {
                url: '/report/withdrawn',
                templateUrl: '/templates/page/report/withdrawn.html',
                controller: 'WithdrawnReportController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/report/withdrawnReportController.js',
                            '/bower_components/angularjs-datepicker/src/js/angular-datepicker.js',
                            '/bower_components/angularjs-datepicker/src/css/angular-datepicker.css',
                            '/js/app/service/DateTimeModule.js',
                            '/js/app/service/ExcelModule.js',
                            '/bower_components/angular-utils-pagination/dirPagination.js'
                        ])
                    }]
                }
            })

            // Transfer report route
            .state('transferReport', {
                url: '/report/transfer',
                templateUrl: '/templates/page/report/transfer.html',
                controller: 'TransferReportController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/report/transferReportController.js',
                            '/bower_components/angularjs-datepicker/src/js/angular-datepicker.js',
                            '/bower_components/angularjs-datepicker/src/css/angular-datepicker.css',
                            '/js/app/service/DateTimeModule.js',
                            '/js/app/service/ExcelModule.js',
                            '/bower_components/angular-utils-pagination/dirPagination.js'
                        ])
                    }]
                }
            })

            // Term Condition route
            .state('termCondition', {
                url: '/term-condition',
                templateUrl: '/templates/page/term_condition.html',
            })

            // Term Condition route
            .state('privacyPolicy', {
                url: '/privacy-policy',
                templateUrl: '/templates/page/privacy_policy.html',
            })

            // Term Condition route
            .state('resposibleGambling', {
                url: '/resposible-gambling',
                templateUrl: '/templates/page/resposible_gambling.html',
            })

            // Sportsbook WFT
            .state('gameSportsBookWFT', {
                url: '/game/sportsbook/wtf',
                templateUrl: '/templates/page/game/sportsbook/WFT.html',
                controller: 'WftController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/wftController.js',
                        ])
                    }]
                }
            })

            // Playtech Slot
            .state('gameSlotPlaytech', {
                url: '/slot/playtech',
                templateUrl: '/templates/page/game/slot/playtech.html',
                controller: 'PlaytechController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/game/playtechController.js',
                            '//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.0.js'
                        ])
                    }]
                }
            })

            // Live Casino
            .state('gameCasino', {
                url: '/casino',
                templateUrl: '/templates/page/game/casino/index.html',
            })

            // Mobile Download
            .state('mobileDownload', {
                url: '/mobile/download',
                templateUrl: '/templates/page/mobile/download.html',
                controller: 'MobileDownloadController',
                authorization: true,
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/js/app/controller/game/mobileDownloadController.js'
                        ])
                    }]
                }
            })

            // Promotion Download
            .state('promotion', {
                url: '/promotion',
                templateUrl: '/templates/page/promotion.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            //'/js/app/controller/game/playtechController.js',
                            '//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.0.js'
                        ])
                    }]
                }
            })
        })
        .run(function($rootScope, $state, $socket, $http, SweetAlert) {

            $rootScope.lang = 'in';

            var updatedCurrentUser = function() {
                var req = {
                    method: 'GET',
                    url: baseUrl + 'api/authenticate/user'
                }

                $http(req)
                    .then(function(response) {

                        var user = JSON.stringify(response.data.user);

                        localStorage.setItem('user', user);

                        $rootScope.currentUser = response.data.user;

                        // Emit this credentials to node server
                        var credentials = {
                            username: $rootScope.currentUser.username,
                            session: localStorage.getItem('satellizer_token')
                        }

                        $socket.emit('auth.login', credentials);

                    }, function(error) {

                        // Remove the authenticated user from local storage
                        localStorage.removeItem('user');
                        localStorage.removeItem('satellizer_token');

                        // Flip authenticated to false so that we no longer
                        // show UI elements dependant on the user being logged in
                        $rootScope.authenticated = false;

                        // Remove the current user info from rootscope
                        $rootScope.currentUser = null;
                        $state.go('home');
                    });
            }

            var user = JSON.parse(localStorage.getItem('user'));

            if (user) {
                updatedCurrentUser();
            }

            $rootScope.$on('credit:update', function() {
                updatedCurrentUser();
            });

            // $stateChangeStart is fired whenever the state changes. We can use some parameters
            // such as toState to hook into details about the state as it is changing
            $rootScope.$on('$stateChangeStart', function(event, toState) {

                // Grab the user from local storage and parse it to an object
                var user = JSON.parse(localStorage.getItem('user'));

                if (user) {

                    $rootScope.authenticated = true;
                    $rootScope.currentUser = user;

                    if (toState.name === "register") {

                        event.preventDefault();
                        $state.go('home');
                    }
                } else if (toState.authorization) {

                    // Go to home and do nothing
                    event.preventDefault();
                    $state.go('home');
                }
            });

            // Show loading
            $rootScope.$on('loading:show', function() {
                $("#loading").show();
            })

            // Hide loading
            $rootScope.$on('loading:hide', function() {
                $("#loading").hide();
            })

            // Fire event transaction accept
            $socket.on('credit.updated', function(data) {
                $rootScope.$broadcast('creditUserInfo:update');
                updatedCurrentUser();
            })

            // Fire event transaction deposit accept
            $socket.on('transaction.deposit.accept', function(data) {
                $rootScope.$broadcast('creditUserInfo:update');
                updatedCurrentUser();
                SweetAlert.swal("Thanks You!", "Your deposit ticket at " + data.created_at + " with " + data.amount + " " + data.currency + " has been approved", "success");
            })

            // Fire event transaction deposit reject
            $socket.on('transaction.deposit.reject', function(data) {
                SweetAlert.swal("Sorry!", "Your deposit ticket at " + data.created_at + " with " + data.amount + " " + data.currency + " has been rejected,  please contact admin for more details !", "error");
            })

            // Fire event transaction withdrawn accept
            $socket.on('transaction.withdrawn.accept', function(data) {
                SweetAlert.swal("Thanks You!", "Your withdrawn ticket at " + data.created_at + " with " + data.amount + " " + data.currency + " has been approved", "success");
            })

            // Fire event transaction withdrawn reject
            $socket.on('transaction.withdrawn.reject', function(data) {
                $rootScope.$broadcast('creditUserInfo:update');
                updatedCurrentUser();
                SweetAlert.swal("Sorry!", "Your withdrawn ticket at " + data.created_at + " with " + data.amount + " " + data.currency + " has been rejected,  please contact admin for more details !", "error");
            })
        });
})();

angular.element(document).ready(function() {
    angular.bootstrap(document, ['betApp']);
});
