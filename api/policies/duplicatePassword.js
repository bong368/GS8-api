module.exports = function(req, res, next) {console.log('eee');

    var ticket = req.body;

    tokenService.parse(req)
        .then(function(user) {
            Users.comparePassword(req.param('password'), user, function(err, valid) {

                if (valid) {
                    return res.json(401, {
                        error: "Playtech password must different with main password!"
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
