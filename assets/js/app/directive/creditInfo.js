(function() {

    'use strict';

    angular
        .module('creditinfo', [])

    .directive('creditinfo', function($timeout, $http) {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'templates/directive/creditInfo.html',
            link: function(scope, elm, attrs) {
                var getCreditUser = function() {
                    $http.get(baseUrl + 'api/user/credit')

                    .then(function(response) {
                        scope.wallets = response.data.data;
                    });
                }
                getCreditUser();

                scope.$on('creditUserInfo:update', function() {
                    getCreditUser();
                });
                var getAllGames = function() {
                    $http.get(baseUrl + 'api/user/game')

                    .then(function(response) {
                        scope.wallets = response.data;
                    });
                }
                getAllGames();
            }
        };
    })
})();
