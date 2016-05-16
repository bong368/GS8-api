(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('PlaytechController', PlaytechController);


    function PlaytechController($state, $http, $rootScope, $scope, SweetAlert, $sce) {
        // Run this function at initial
        $scope.ini = function() {
            
            $scope.getPlaytech();
        }

        $scope.getPlaytech = function() {
            var gameCode = $state.params.id;
            var req = {
                method: 'POST',
                url: baseUrl + 'api/playtech/signin',
                data: {gameCode: gameCode}
            }

            $http(req)
                .then(function(response) {
                    $rootScope.srcIframe = response.data.data;
                    
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.ini();
    }

})();
