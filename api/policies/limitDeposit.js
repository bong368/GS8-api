module.exports = function(req, res, next) {

    LimitTransaction.find()
        .then(function(limit) {

            var ticket = req.body;
            limit = limit[0];

            // If amount greet than limit
            if (ticket.amount > limit.deposit_max) {
                return res.json(401, { error: 'Amount cannot greater than ' + limit.deposit_max + ' ' + limit.currency });
            }
            // If amount less than limit
            else if (ticket.amount < limit.deposit_min) {
                return res.json(401, { error: 'Amount cannot less than ' + limit.deposit_min + ' ' + limit.currency });
            }
            // Return promise
            else
                next();
        })  
};
