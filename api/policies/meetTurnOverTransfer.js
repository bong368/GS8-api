module.exports = function(req, res, next) {

    var ticket = req.body;

    if (ticket.target == 'Main Wallet') {
        var rollingAmount = undefined;
        oldTurnOver = undefined;

        tokenService.parse(req)
            .then(function(user) {
                if (user.user_bonus_id) {
                    UserBonus.findOne({ id: user.user_bonus_id })

                    .then(function(bonus) {

                        if (bonus.bonus_id == 1)
                            next();
                        else {

                            rollingAmount = bonus.rolling_amount;
                            oldTurnOver = bonus.turnover;
                            grossApiGameService.getTurnOver(ticket.username)
                            
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
                } else
                    next();
            })

    } else
        next();
};
