module.exports = function(req, res, next) {

    sailsTokenAuth.parseToken(req)
        .then(function(user) {
            return Deposits.findOne({
                username: user.username,
                status: 'pending'
            })
        })
        .then(function(deposit) {
            if (deposit) {
                return res.json(401, { error: 'Please wait before processing your ticket' });
            }
            next();
        })
        
};
