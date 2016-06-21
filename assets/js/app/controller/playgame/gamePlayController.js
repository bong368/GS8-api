(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('GamePlayController', GamePlayController);


    function GamePlayController($state, $http, $rootScope, $scope, SweetAlert, $sce) {
        // Run this function at initial
        $scope.ini = function() {
            
            $scope.getGamePlay();
        }

        $scope.getGamePlay = function() {
            var gameCode = $state.params.id;
            var mode = $state.params.mode;
            var token = localStorage.getItem('satellizer_token');
            $rootScope.srcIframe = 'http://slots.globalintgames.com/?fun=' + mode + '&gameid=' + gameCode + '&lang=en-us&op=HOKIBET188&token=' + token;
        }

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.ini();
    }

})();
