(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('GamePlayController', GamePlayController);


    function GamePlayController($state, $http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {
            $scope.token = localStorage.getItem('satellizer_token');
            $scope.getGamePlay();
        }

        $scope.getGamePlay = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/slot/gameplay'
            }

            $http(req)
                .then(function(response) {
                    $scope.allGame = response.data;
                    $scope.renderGame('3D slots');
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.renderGame = function(gameGroup) {
            $scope.availableGame = $scope.allGame[gameGroup];
        }
        $scope.changeTabTo = function(gameCode) {
            $scope.currentGroup = gameCode;
            $scope.renderGame(gameCode);
        }

        $scope.myInterval = 3000;
        $scope.slides = [{
            image: '/images/playtech/Slot_PT.png'
        }, {
            image: '/images/playtech/Slot_AG.png'
        }, {
            image: '/images/playtech/Slot_GP.png'
        }, {
            image: '/images/playtech/Slot_MG.png'
        }];

        $scope.ini();
    }

})();
