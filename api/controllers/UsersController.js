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
            .then(function(results) {
                return res.json(results);
            })
    },

    // Update Password
    updatePassword: function(req, res) {
        var ticket = requestService.only(['password'], req); console.log(ticket.password);
        Users.hashPassword(ticket.password)
            .then(function (hash) {
                return res.json(200, {hash: hash});
            })
    }
};
