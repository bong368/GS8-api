module.exports = function(req, res, next) {

    var ticket = req.body;

    if (ticket.target == 'Main Wallet') {
        var rollingAmount = undefined;
        oldTurnOver = undefined;
        user = undefined;
        tokenService.parse(req)
            .then(function(creds) {
                user = creds;
                return UserBonus.findOne({ username: creds.username })
            })
            .then(function(bonus) {
                if (bonus) {
                    if (bonus.bonus_id == 1)
                        next();
                    else {
                        Transfers.findOne({ id: bonus.transaction_id })
                            .then(function(transfer) {
                                if (ticket.origin != transfer.target) {
                                    next()
                                } else {
                                    rollingAmount = bonus.rolling_amount;
                                    oldTurnOver = bonus.turnover;
                                    grossApiGameService.getTurnOver(user.username, ticket.origin)

                                    .then(function(turnOvers) {
                                        if ((turnOvers.data - oldTurnOver) < rollingAmount) {
                                            var errorTurnover = ' | Turnover now is: ' + (turnOvers.data - oldTurnOver) + ' ' + user.currency;
                                            var errorRolling = ' | Rolling amount now is: ' + rollingAmount + ' ' + user.currency;
                                            return res.json(401, { error: "Need meet Turnover to transfer back main wallet" + errorTurnover + errorRolling });
                                        } else
                                            next();
                                    })
                                }
                            })
                    }
                } else {
                    next();
                }
            })

    } else
        next();
};
