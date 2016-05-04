/**
 * Request Service
 *
 * @description :: Server-side logic for Bonus Request
 */
var promise = require('bluebird');
module.exports = {

    getTransferBonus: function(username) {
        return new promise(function(resolve, reject) {

            Users.findOne({ username: username })
                .then(function(user) {

                    if (user.user_bonus_id)
                    	return resolve({bonus: false});

                    else if (user.welcome_bonus_yet) {
                        Bonus.findOne({ title: 'loyalty' })
                            .then(function(bonus) {
                                return resolve({bonus: bonus});
                            })
                    } else {
                        Bonus.findOne({ title: 'welcome' })
                            .then(function(bonus) {
                                return resolve({bonus: bonus});
                            })
                    }
                })
        })
    }


};
