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

            if ($state.params.group == '3D slots')
                var slotGPUrl = 'http://slots.globalintgames.com/';
            else
                var slotGPUrl = 'http://rslots.gpiops.com/lanternfestival';

            if (gameCode != 'casino')
                $rootScope.srcIframe = slotGPUrl + '?fun=' + mode + '&gameid=' + gameCode + '&lang=en-us&op=HOKIBET188&token=' + token;
            else
                $rootScope.srcIframe = 'http://casino.gpiops.com/?m=normal&lang=en-us&op=HOKIBET188&token=' + token;
        }

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.ini();
    }

})();
