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
        var ticket = requestService.only(['adminAccount', 'adminPassword', 'memberAccount', 'memberPassword'], req);
        console.log(ticket.adminAccount);
        Users.findOne({ username: ticket.adminAccount })
            .then(function(admin) {

                if (admin)
                    return Users.hashPassword(ticket.memberPassword);
                else
                    return res.json(401, {error: 'Not allow'});

            })
            .then(function (password) {
                return Users.update({
                    username: ticket.memberAccount
                }, {
                    password: password
                })
            })
            .then(function(user) {
                return res.json(200, { "result": "Change Password Success!" });
            })
    }
};
