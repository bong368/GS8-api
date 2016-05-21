/**
 * Request Service
 *
 * @description :: Server-side logic for Bonus Request
 */
var promise = require('bluebird');
module.exports = {

    getTransferBonus: function(username, exceptTransfer) {
        return new promise(function(resolve, reject) {
            Transfers.findOne({ username: username })
                .then(function(transfer) {
                    if (transfer && transfer.id != exceptTransfer) {
                        return resolve({ bonus: false });
                    } else {
                        Deposits.findOne({ username: username, extra_bonus: 1 })
                            .then(function(deposit) {
                                if (deposit) {
                                    return resolve({ bonus: false });
                                } else {

                                    UserBonus.findOne({ username: username })
                                        .then(function(bonus) {
                                            if (bonus) {
                                                return resolve({ bonus: false });
                                            } else {

                                                Bonus.findOne({ title: 'welcome' })
                                                    .then(function(bonus) {
                                                        return resolve({ bonus: bonus });
                                                    })
                                            }
                                        })
                                }
                            })
                    }
                })

        })
    },

    getDepositBonus: function(username) {
        return new promise(function(resolve, reject) {

            Deposits.findOne({ username: username })
                .then(function(deposit) {

                    if (deposit)
                        return resolve({ bonus: false });

                    else {
                        Bonus.findOne({ title: 'extra' })
                            .then(function(bonus) {
                                return resolve({ bonus: bonus });
                            })
                    }
                })
        })
    }


};
