(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('MobileDownloadController', MobileDownloadController);


    function MobileDownloadController($state, $http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {
            $scope.view_tab = 'playtech';
        }

        $scope.changeTab = function(tab) {
            $scope.view_tab = tab;
        }

        $scope.changePTPassword = function () {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/playtech/password',
                data: {password: $scope.PT.password}
            }

            $http(req)
                .then(function(response) {
                    SweetAlert.swal("Thanks You!", "Updated Success ", "success");
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.changeABPassword = function () {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/allbet/password',
                data: {password: $scope.AB.password}
            }

            $http(req)
                .then(function(response) {
                    SweetAlert.swal("Thanks You!", "Updated Success ", "success");
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.changeGPPassword = function () {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/allbet/password',
                data: {password: $scope.GP.password}
            }

            $http(req)
                .then(function(response) {
                    SweetAlert.swal("Thanks You!", "Updated Success ", "success");
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        $scope.ini();
    }

})();
