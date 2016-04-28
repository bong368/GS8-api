(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('TransferMainToGameController', TransferMainToGameController);


    function TransferMainToGameController($http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {

            var req = {
                method: 'GET',
                url: baseUrl + 'api/game/title',
            }

            $http(req)
                .then(function(response) {
                    $scope.srcIframe = response.data.data.data;
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.ini();
    }

})();
