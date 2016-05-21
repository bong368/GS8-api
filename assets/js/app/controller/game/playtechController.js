(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('PlaytechController', PlaytechController);


    function PlaytechController($state, $http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {

            $scope.getPlaytech();
        }

        $scope.getPlaytech = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/slot/playtech'
            }

            $http(req)
                .then(function(response) {
                    $scope.allGame = response.data;
                    $scope.titles = $scope.getTitle(response.data);
                    $scope.renderGame('Slots');
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.renderGame = function(gameGroup) {
            $scope.availableGame = [];
            angular.forEach($scope.allGame, function(value, key) {
                if (value.game_group == gameGroup)
                    $scope.availableGame.push(value);
            });
        }

        $scope.getTitle = function(data) {
            var titles = [];
            angular.forEach(data, function(value, key) {
                if (titles.indexOf(value.game_group) == -1)
                    titles.push(value.game_group);
            });
            return titles;
        }

        $scope.changeTabTo = function(gameCode) {
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
