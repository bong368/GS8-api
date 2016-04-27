(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('TransferController', TransferController);


    function TransferController($http, $rootScope, $scope) {
        // Run this function at initial
        $scope.ini = function() {

            $scope.tabs = [{
                title: 'Transfer from main balance to game',
                url: '/templates/components/transfer/mainToGame.html'
            }, {
                title: 'Transfer from game to main balance',
                url: '/templates/components/transfer/GameToMain.html'
            }];

            $scope.currentTab = '/templates/components/transfer/mainToGame.html';

            $scope.changeToTab = function(tab) {
                $scope.currentTab = tab.url;
            }
        }

        $scope.ini();
    }

})();
