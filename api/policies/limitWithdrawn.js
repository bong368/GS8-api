module.exports = function(req, res, next) {

    var ticket = req.body;

    LimitTransaction.find()
        .then(function(limit) {

            var limit = limit[0];

            // If amount greet than limit
            if (ticket.amount > limit.withdraw_max) {
                return res.json(401, { error: 'Amount cannot greater than ' + limit.withdraw_max + ' ' + limit.currency });
            }
            // If amount less than limit
            else if (ticket.amount < limit.withdraw_min) {
                return res.json(401, { error: 'Amount cannot less than ' + limit.withdraw_min + ' ' + limit.currency });
            }

            // Return promise
            else
                return sailsTokenAuth.parseToken(req);
        })
        .then(function(user) {

            // Reject ticket if invalid amount
            if (user.main_balance < ticket.amount) {
                return res.json(401, { error: 'Your balance is not enough to perform this transaction' });
            } else {
                return Withdrawns.findOne({
                    username: user.username,
                    status: 'pending'
                })
            }
        })
        .then(function (withdrawn) {
        	if (withdrawn) {
        		return res.json(401, { error: 'Please wait before processing your ticket' });
        	}
        	//next();
        })

};
