module.exports = function(req, res, next) {

    var ticket = req.body;
    tokenService.parse(req)
        .then(function(user) {

            // Reject ticket if invalid amount
            if (parseFloat(user.main_balance) < parseFloat(ticket.amount)) {

                return res.json(401, { error: 'Your balance is not enough to perform this transaction' });

            } else if (ticket.amount < 1) {

                return res.json(401, { error: 'Your amount is not enough to perform this transaction' });
                
            } else {
                next();
            }
        })
};
