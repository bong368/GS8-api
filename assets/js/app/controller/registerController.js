(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('RegisterController', RegisterController);


    function RegisterController($auth, $state, $http, $rootScope, $scope, ngDialog, $translate, SweetAlert) {

        // Run this function at initial
        $scope.ini = function() {
            $scope.bindBanking();
        },

        // Setup models
        $scope.state = {
            condition   : false
        }

        $scope.user = {
            prefix_phone : '+62'
        }

        $scope.reset = function () {
            $scope.error = {
                username    : '',
                email       : '',
                password    : '',
                password_confirmation : '',
                currency    : '',
                phone       : '',
                bank_name   : '',
                bank_account_number : '',
                bank_account_name : '',
            }
        }

        // Bind banking
        $scope.bindBanking = function() {

            $http.get(baseUrl + 'api/banking/all')

                .then(function(response) {
                    $scope.bankings = response.data.data;
                    $scope.user.bank_id = $scope.bankings[0].id;
                });
        }
        
        // Excute register new user
        $scope.register = function() {

            $scope.reset();

            if ( !$scope.state.condition ) {

                var dialogScope = $scope.$new(true);

                // Config message error
                dialogScope.error = 'I acknowledge I am at least 18 years old. Please Check!';

                ngDialog.open({ 

                    // Config dialog
                    template: 'assets/view/dialog/popupTmpl.html', 
                    className: 'ngdialog-theme-flat ngdialog-theme-custom',
                    scope: dialogScope
                });
                // Do nothing
                return false;

            } else {

                $scope.user.phone = $scope.user.prefix_phone + $scope.user.body_phone;

                $auth
                    .signup($scope.user)
                    .then(function(response) {

                        SweetAlert.swal("Thanks You!", "Register Success ", "success");
                        $auth.setToken(response);
                        // Return an $http request for the now authenticated
                        // user so that we can flatten the promise chain
                        return $http.get(baseUrl + 'api/authenticate/user');

                    // Handle errors
                    }, function(error) {

                        angular.forEach(error.data.data, function(value, key) {
                            $scope.error[key] = value[0];
                        })

                    // Because we returned the $http.get request in the $auth.login
                    // promise, we can chain the next promise to the end here
                    }).then(function(response) {

                        // Stringify the returned data to prepare it
                        // to go into local storage
                        var user = JSON.stringify(response.data.user);

                        // Set the stringified user data into local storage
                        localStorage.setItem('user', user);

                        // The user's authenticated state gets flipped to
                        // true so we can now show parts of the UI that rely
                        // on the user being logged in
                        $rootScope.authenticated = true;

                        // Putting the user's data on $rootScope allows
                        // us to access it anywhere across the app
                        $rootScope.currentUser = response.data.user;

                        // Everything worked out so we can now redirect to
                        // the users state to view the data
                        $state.go('home');
                    });
                    
            }
            
        }

        $scope.showCondition = function() {
            var dialogScope = $scope.$new(true);

            // Config message error
            dialogScope.message = $translate.instant('CONTENT_AGREE');
            ngDialog.open({ 

                // Config dialog
                template: 'assets/view/dialog/condition.html', 
                className: 'ngdialog-theme-flat ngdialog-theme-custom custom-width',
                scope: dialogScope
            });
        }

        // Run function config initial
        $scope.ini();
    }

})();