module.exports = function(req, res, next) {

    var ticket = req.body;

    if (ticket.target == 'Main Wallet') {

        var rollingAmount = undefined;
        user = undefined;
        agent = undefined;

        tokenService.parse(req)
            .then(function(creds) {

                user = creds;
                agent = creds.parent_id;
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
                                    grossApiGameService.getTurnOver(user.username, agent, bonus.created_at, ticket.origin)

                                    .then(function(turnOver) {
                                        if (turnOver.data < rollingAmount) {
                                            var errorTurnover = ' \n Turnover now is: ' + turnOver.data + ' ' + user.currency;
                                            var errorRolling = ' \n Rolling amount now is: ' + rollingAmount + ' ' + user.currency;
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
