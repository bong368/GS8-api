module.exports = function(req, res, next) {

    tokenService.parse(req)
        .then(function(user) {
            return Deposits.findOne({
                username: user.username,
                status: 'pending'
            })
        })
        .then(function(deposit) {
            if (deposit) {
                return res.json(401, { error: 'Pending transaction exists' });
            }
            next();
        })
        
};
