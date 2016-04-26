(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('WftController', WftController);


    function WftController($auth, $state, $http, $rootScope, $scope, $sce, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/wft/signin',
            }

            $http(req)
                .then(function(response) {
                    $scope.srcIframe = response.data.data;
                    console.log($scope.trustSrc($scope.srcIframe));
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
