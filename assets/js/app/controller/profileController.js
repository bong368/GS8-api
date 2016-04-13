(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('ProfileController', ProfileController);


    function ProfileController($socket, $auth, $state, $http, $rootScope, $scope, ngDialog) {

        // Run this function at initial
        $scope.ini = function() {

            $scope.user = {
                old_password : '',
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
                    $scope.message = response.data.result;
                    ngDialog.open({ 

                        // Config dialog
                        template: 'assets/view/dialog/popupSuccess.html', 
                        className: 'ngdialog-theme-flat ngdialog-theme-custom',
                        scope: $scope
                    });

                }, function(error) {
                    angular.forEach(error.data.data, function(value, key) {
                        $scope.error[key] = value[0];
                    })
                });
        }

        // Run function config initial
        $scope.ini();
    }

})();