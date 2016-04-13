(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('DepositController', DepositController);


    function DepositController($auth, $state, $http, $scope, ngDialog, $rootScope, $socket) {

        // Run this function at initial
        $scope.ini = function() {

            $scope.deposit = {
                amount : '',
                password : '',
                extra_bonus : false,
                currency : $rootScope.currentUser.currency,
                payment_method : 'Local Transfer',
                from_bank : $rootScope.currentUser.bank_name,
                bank_account_name : $rootScope.currentUser.bank_account_name,
                bank_account_number : $rootScope.currentUser.bank_account_number 
            };

            $scope.bindTransactionLimit();
            
            $scope.bindBanking();
        },


        // Bind banking
        $scope.bindBanking = function() {

            $http.get(baseUrl + 'api/banking/all')

                .then(function(response) {
                    $scope.systemBankings = response.data.data;
                    $scope.deposit.to_bank = $scope.systemBankings[0].bank_name;
                    $scope.bindBankingDetails($scope.deposit.to_bank);
                });
        }

        $scope.bindBankingDetails = function(bank_name) {
            angular.forEach($scope.systemBankings, function(value, key) {
                if ( bank_name == value.bank_name ) {
                    $scope.systemBankingDetail = {
                        account_name : value.account_name,
                        account_number : value.account_number
                    }
                }
            });
        }

        $scope.changeSystemBanking = function() {
            $scope.bindBankingDetails($scope.deposit.to_bank);
        }

        // Bind banking
        $scope.bindTransactionLimit = function() {

            $http.get(baseUrl + 'api/transaction/limit/deposit')

                .then(function(response) {
                
                    response.data.data.deposit_min = parseInt(response.data.data.deposit_min);
                    response.data.data.deposit_max = parseInt(response.data.data.deposit_max);

                    $scope.limit = response.data.data;
                });
        }

        // Submit ticket
        $scope.submitDeposit = function() {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/cashier/deposit',
                data: $scope.deposit
            }

            $http(req)
                .then(function(response) {
                    
                    // Emit to node server
                    response.data.extra_bonus = $scope.deposit.extra_bonus;
                    $socket.emit('transaction.deposit', response.data);

                    $scope.reportState = '#/report/deposit';
                    $scope.message = 'Thank you! We have received your ticket!';
                    ngDialog.open({ 

                        // Config dialog
                        template: 'assets/view/dialog/popupSuccess.html', 
                        className: 'ngdialog-theme-flat ngdialog-theme-custom',
                        closeByNavigation : true,
                        scope: $scope
                    });

                }, function(error) {
                    $scope.error = error.data.error;
                    ngDialog.open({ 

                        // Config dialog
                        template: 'assets/view/dialog/popupTmpl.html', 
                        className: 'ngdialog-theme-flat ngdialog-theme-custom',
                        closeByNavigation : true,
                        scope: $scope
                    });
                });
        }

        // Run function config initial
        $scope.ini();
    }

})();