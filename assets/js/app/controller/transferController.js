(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('TransferController', TransferController);


    function TransferController($http, $rootScope, $scope) {
        // Run this function at initial
        $scope.ini = function() {

            $scope.tabs = [{
                title: 'Main balance to game',
                url: '/templates/page/transactions/transferMainToGame.html'
            }, {
                title: 'Game to main balance',
                url: '/templates/page/transactions/transferGameToMain.html'
            }];

            $scope.currentTab = '/templates/page/transactions/transferMainToGame.html';

            $scope.changeToTab = function(tab) {
                $scope.currentTab = tab;
            }
        }

        $scope.ini();
    }

})();
