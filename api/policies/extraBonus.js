module.exports = function(req, res, next) {

    var ticket = req.body;
    var user = undefined;
    tokenService.parse(req)
        .then(function(token) {
        	user = token;
        	return Deposits.findOne({username: user.username})
        })
        .then(function (deposit) {
        	if (ticket.extra_bonus && deposit) {
                return res.json(401, { error: 'You only get the bonus at first times' });
            } else {
                next();
            }
        })
};
