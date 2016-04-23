/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Handle a login request to the application.
     *
     * @param  res
     * @return req
     */
    authenticate: function(req, res) {

        var ticket = req.body;

        if (!ticket.username || !ticket.password) {
            return res.json(401, { error: 'username and password required' });
        }

        Users.findOne({
            username: ticket.username
        }).exec(function(err, user) {

            if (!user) {
                return res.json(401, { error: 'invalid username or password' });
            }

            Users.comparePassword(ticket.password, user, function(err, valid) {

                if (!valid) {
                    return res.json(401, { error: 'invalid username or password' });
                } else {
                    res.json({ token: tokenService.generate({ sid: user.id }) });
                }

            });
        });
    },

    /**
     * Handle a user request to create new user.
     *
     * @param  res
     * @return req
     */
    register: function(req, res) {

        var credentials = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            currency: req.body.currency,
            bank_id: req.body.bank_id,
            bank_account_number: req.body.bank_account_number,
            bank_account_name: req.body.bank_account_name
        }

        Users.create(credentials).exec(function(err, user) {
            if (err) {
                // If these error from validation
                if (err.code == 'E_VALIDATION') {
                    return res.json(err.status, {
                        result: false,
                        data: err.Errors
                    });
                } else {
                    console.log(err.code);
                    return;
                }
            }
            if (user) {
                res.json({
                    token: tokenService.generate({ sid: user.id })
                });
            }
        });
    },

    /**
     * Validate token, if true return credentials, false if invalid token
     *
     * @param  res
     * @return req
     */
    user: function(req, res) {

        tokenService.parse(req)
            .then(function(user) {
                res.json(200, { user: user });
            })
            .catch(function(err) {
                return res.json(401, { error: 'token_invalid' });
            })
    },

    /**
     * Change Password
     *
     * @param  res
     * @return req
     */
    changePassword: function(req, res) {

        var ticket = req.body;
        cred = undefined;
        tokenService.parse(req)
            .then(function(user) {

                cred = user;
                return Users.hashPassword(ticket.new_password);

            })
            .then(function (password) {

                return Users.update({
                    username: cred.username
                }, {
                    password: password
                })
                
            })
            .then(function(user) {
                res.json(200, { "result": "Change Password Success!" });
            })
    },
};
