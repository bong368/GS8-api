(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('TransferController', TransferController);


    function TransferController($http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {
            $scope.getAllGame();
            $scope.mainWallet = 'Main Wallet';
        }

        $scope.getAllGame = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/game/all/title'
            }

            $http(req)
                .then(function(response) {
                    $scope.games = angular.copy(response.data);
                    $scope.transferTos = angular.copy(response.data);
                    $scope.transferFroms = angular.copy(response.data);
                    $scope.transferFroms.unshift($scope.mainWallet);

                    $scope.ticket = {
                        origin: $scope.transferFroms[0],
                        target: $scope.transferTos[0]
                    }
                    
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.changeTransferFrom = function(wallet){
            if (wallet != $scope.mainWallet) {
                $scope.transferTos = [$scope.mainWallet];
                $scope.ticket.target = $scope.transferTos[0];
            } else {
                $scope.transferTos = angular.copy($scope.games);
                $scope.ticket.target = $scope.transferTos[0];
            }
        }

        $scope.submitTransfer = function () {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/cashier/transfer',
                data: $scope.ticket
            }

            $http(req)
                .then(function(response) {
                    
                    
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }
        $scope.ini();
    }

})();
