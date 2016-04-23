module.exports = function(req, res, next) {
    tokenService.parse(req)
    .then(function(user) {
            Users.comparePassword(req.param('password'), user, function(err, valid) {
                if (err) {
                    return res.json(403, { err: 'forbidden' });
                }

                if (!valid) {
                    return res.json(401, { error: 'Invalid password' });
                } else {
                    next();
                }
            });

        })
        .catch(function(err) {
            return res.json(401, { error: 'token_invalid' });
        })
};
