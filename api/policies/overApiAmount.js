module.exports = function(req, res, next) {

    var ticket = req.body;
    tokenService.parse(req)
        .then(function(user) {
            var originService = grossApiGameService.getServiceFromName(ticket.origin);
            return originService.getBalance(user.username);
        })
        .then(function(result) {

            if ( parseFloat(result.data) < parseFloat(ticket.amount))
                return res.json(401, { error: 'Your balance at ' + result.title + ' is not enough to perform this transaction' });
            else {
                next();
            }
        })
};
