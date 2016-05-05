module.exports = function(req, res, next) {

    var ticket = req.body;

    if (ticket.target == 'Main Wallet') {
    	var rolling_amount = undefined;

        tokenService.parse(req)
            .then(function(user) {
            	if(user.user_bonus_id) {
            		UserBonus.findOne({id: user.user_bonus_id})
            			.then(function (bonus) {
            				rolling_amount = bonus.rolling_amount;
            				return grossApiGameService.getTurnOver(ticket.username);
            			})
            			.then(function (turnOvers) {
            				if (turnOvers.data < rolling_amount)
            					return res.json(401, {error: "Need meet Turnover (" + turnOvers.data + " " + user.currency +") to transfer back main wallet"});
            				else
            					next();
            			})
            	}
                else
                	next();
            })

    } else
        next();
};
