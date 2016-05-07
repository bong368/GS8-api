(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('DepositReportController', DepositReportController);


    function DepositReportController($socket, $auth, $state, $http, $rootScope, $scope, ngDialog, $DateTime, $excel, $timeout) {
    	
    	// Run this function at initial
        $scope.ini = function() {

        	// Config perPage model
            $scope.currentPage = 1;
            $scope.pageSize = 5;

            // Config sort
            $scope.predicate = 'created_at';
            $scope.reverse = true;

        	$scope.ticket = {
        		date_from : $DateTime.getFirstDayOfMonth(),
        		date_to : $DateTime.getToday()
        	}

        	$scope.submitTicket();
        }

        // Submit ticket
        $scope.submitTicket = function() {
        	var req = {
                method: 'POST',
                url: baseUrl + 'api/transaction/report/deposit',
                data: $scope.ticket 
            }

            $http(req)
                .then(function(response) {
                    $scope.reports = response.data;

                }, function(error) {
                    
                });
        }

        // Export to Excel file
        $scope.exportToExcel = function(tableId) {
            var sheetName = 'Hokibet reports-' + $scope.currentPage,
                exportHref = $excel.tableToExcel(tableId, sheetName);
            $timeout(function() {
                location.href = exportHref;
            }, 100); // trigger download
        }

    	// Run function config initial
        $scope.ini();
    }

})();