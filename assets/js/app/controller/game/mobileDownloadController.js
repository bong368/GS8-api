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

        $scope.ini();
    }

})();
