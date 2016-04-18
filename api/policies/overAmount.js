module.exports = function(req, res, next) {

    var ticket = req.body;

    sailsTokenAuth.parseToken(req)
        .then(function(user) {

            // Reject ticket if invalid amount
            if (user.main_balance < ticket.amount) {
                return res.json(401, { error: 'Your balance is not enough to perform this transaction' });
            } else {
                next();
            }
        })
};
