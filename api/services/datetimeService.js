/**
 * Request Service
 *
 * @description :: Server-side logic for managing Request
 */

module.exports = {

    getmmdd: function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return today = mm + dd;
    },


};
