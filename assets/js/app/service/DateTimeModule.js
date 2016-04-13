(function() {

    angular
        .module('betApp')
        .factory('$DateTime', DateTimeService);


    function DateTimeService() {

        // Private config
        var format = '-';

        return {

            getToday : function() {
                var today = new Date(),
                    dd = today.getDate(),
                    mm = today.getMonth() + 1, //January is 0!
                    yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                } 
                if (mm < 10) {
                    mm = '0' + mm
                } 
                var result = yyyy + format + mm + format + dd;

                return result;
            },

            getFirstDayOfMonth : function() {
                var today = new Date();
                var dd = 01;
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                } 
                if (mm < 10) {
                    mm = '0' + mm
                } 
                var result = yyyy + format + mm + format + dd;

                return result;
            }
        }
    }

})();