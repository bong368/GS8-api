/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getCreditUserInfo: function(req, res) {
        var ticket = req.body;

        tokenService.parse(req)
            .then(function(user) {
                return grossApiGameService.getBalance(user.username)
            })
            .then(function (results) {
                return res.json(results);
            })
    }
};
