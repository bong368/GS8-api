(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('ProfileController', ProfileController);


    function ProfileController($socket, $auth, $state, $http, $rootScope, $scope, SweetAlert) {

        // Run this function at initial
        $scope.ini = function() {

            $scope.user = {
                new_password : '',
                password    : '',
                password_confirmation : '',
            }

        }

        $scope.reset = function () {
            $scope.error = {
                old_password : '',
                password    : '',
                password_confirmation : '',
            }
        }

        // Change password
        $scope.changePassword = function() {

            $scope.reset();

            var req = {
                method: 'PUT',
                url: baseUrl + 'api/authenticate/password/reset',
                data: $scope.user
            }

            $http(req)
                .then(function(response) {
                    SweetAlert.swal("Thanks You!", "Change Password Success!", "success");

                }, function(error) {
                    angular.forEach(error.data.data, function(value, key) {
                        $scope.error[key] = value;
                    })
                });
        }

        // Run function config initial
        $scope.ini();
    }

})();