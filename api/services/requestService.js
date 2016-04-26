/**
 * Request Service
 *
 * @description :: Server-side logic for managing Request
 */

module.exports = {

    only: function(parameters, req) {
        var requireds = {};
        parameters.forEach(function(parameter) {
            if (req.param([parameter])) {
                requireds[parameter] = req.param([parameter]);
            }
        });

        return requireds;
    },


};
