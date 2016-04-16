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
        var username = req.param('username');
        var password = req.param('password');

        if (!username || !password) {
            return res.json(401, { error: 'username and password required' });
        }

        Users.findOne({
            username: username
        }).exec(function(err, user) {
            if (!user) {
                return res.json(401, { error: 'invalid username or password' });
            }

            Users.comparePassword(password, user, function(err, valid) {
                if (err) {
                    return res.json(403, { err: 'forbidden' });
                }

                if (!valid) {
                    return res.json(401, { error: 'invalid username or password' });
                } else {
                    res.json({ user: user, token: sailsTokenAuth.issueToken({ sid: user.id }) });
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
                    res.json(err.status, { err: err });
                    return;
                }
            }
            if (user) {
                res.json({ user: user, token: sailsTokenAuth.issueToken({ sid: user.id }) });
            }
        });
    }
};
