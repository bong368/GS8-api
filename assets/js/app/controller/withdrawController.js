(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('WithdrawController', WithdrawController);


    function WithdrawController($auth, $state, $http, $scope, ngDialog, $rootScope, $socket, SweetAlert) {

        // Run this function at initial
        $scope.ini = function() {

            $scope.ticket = {
                amount : '',
                password : '',
                currency : $rootScope.currentUser.currency,
                payment_method : 'Local Transfer',
                bank_name : $rootScope.currentUser.bank_name,
                bank_account_name : $rootScope.currentUser.bank_account_name,
                bank_account_number : $rootScope.currentUser.bank_account_number 
            };

            $scope.bindTransactionLimit();
            
        },

        // Bind banking
        $scope.bindTransactionLimit = function() {

            $http.get(baseUrl + 'api/transaction/limit')

                .then(function(response) {
                
                    response.data.data.withdraw_min = parseInt(response.data.data.withdraw_min);
                    response.data.data.withdraw_max = parseInt(response.data.data.withdraw_max);

                    $scope.limit = response.data.data;
                });
        }

        // Submit ticket
        $scope.submitTicket = function() {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/cashier/withdrawn',
                data: $scope.ticket
            }

            $http(req)
                .then(function(response) {

                    updatedCurrentUser();

                    // Emit to node server
                    $socket.emit('transaction.withdraw', response.data);

                    SweetAlert.swal({
                            title: "Thank you!",
                            text: "We have received your ticket!",
                            type: "success",
                            allowOutsideClick: true,
                            confirmButtonText: "View Report"
                        },
                        function() {
                            $state.go('withdrawnReport');
                        });

                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        var updatedCurrentUser = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/authenticate/user'
            }

            $http(req)
                .then(function(response) {

                    // Stringify the returned data to prepare it
                    // to go into local storage
                    var user = JSON.stringify(response.data.user);

                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);

                    $rootScope.currentUser = response.data.user;

                    // Emit this credentials to node server
                    var credentials = {
                        username : $rootScope.currentUser.username, 
                        session : auth.session
                    }

                    $socket.emit('auth.login', credentials);

                }, function(error) {

                    // Remove the authenticated user from local storage
                    localStorage.removeItem('user');

                    // Flip authenticated to false so that we no longer
                    // show UI elements dependant on the user being logged in
                    $rootScope.authenticated = false;

                    // Remove the current user info from rootscope
                    $rootScope.currentUser = null;
                    $state.go('home');
                });
        }

        // Run function config initial
        $scope.ini();
    }

})();