module.exports = function(req, res, next) {

    var ticket = req.body;

    if (ticket.new_password != ticket.password_confirmation) {
        return res.json(401, {
            data: {
                'password_confirmation': 'Password confirmation not match'
            }
        });
    } else if (ticket.new_password == ticket.password) {
        return res.json(401, {
            data: {
                'password': 'Invalid new password, try another'
            }
        });
    } else if (!Users.validatePassword(ticket.password)) {
        return res.json(401, {
            data: {
                'password': 'New password not match with format, try another'
            }
        });
    }

    tokenService.parse(req)
        .then(function(user) {
            Users.comparePassword(req.param('password'), user, function(err, valid) {

                if (!valid) {
                    return res.json(401, {
                        data: {
                            'password': 'Invalid password'
                        }
                    });
                } else {
                    next();
                }
            });

        })
        .catch(function(err) {
            return res.json(401, { error: 'token_invalid' });
        })
};
