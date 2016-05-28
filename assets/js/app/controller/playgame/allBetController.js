(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('AllBetController', AllBetController);


    function AllBetController($state, $http, $rootScope, $scope, SweetAlert, $sce) {
        // Run this function at initial
        $scope.ini = function() {
            
            $scope.getAllBet();
        }

        $scope.getAllBet = function() {
            var req = {
                method: 'POST',
                url: baseUrl + 'api/allbet/signin'
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
