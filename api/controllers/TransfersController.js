/**
 * TransfersController
 *
 * @description :: Server-side logic for managing Transfers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Create new transfer ticket
     *
     * @param  res
     * @return req
     */
    create: function(req, res) {

        var self = this;
        ticket = requestService.only(['origin', 'target', 'amount', 'bonus'], req);
        if (ticket.target == 'Main Wallet')
            ticket.bonus = false;

        tokenService.parse(req)
            .then(function(user) {

                // Config transfer ticket
                ticket = _.merge(ticket, {
                    username: user.username,
                    currency: user.currency
                });

                return Transfers.create(ticket);
            })
            .then(function(transfer) {

                // Get target and origin service
                var originService = grossApiGameService.getServiceFromName(ticket.origin);
                targetService = grossApiGameService.getServiceFromName(ticket.target);
                ticket.id = transfer.id;

                // Resolved bonus before transfer exec
                if (ticket.bonus) {
                    bonusService.getTransferBonus(ticket.username)
                        .then(function(bonus) {
                            ticket.bonus = bonus.bonus;
                            return self.asyncTransfer(originService, targetService, ticket, req, res);
                        })
                } else
                    return self.asyncTransfer(originService, targetService, ticket, req, res);
            })
    },

    // Exec async transfer
    asyncTransfer: function(originService, targetService, ticket, req, res) {

        var self = this;

        async.parallel({

                origin_result: function(callback) {

                    originService.withdrawn(ticket)
                        .then(function(response) {
                            callback(null, response);
                        })
                        .catch(function(error) {
                            callback(null, error);
                        })
                },

                target_result: function(callback) {

                    var targetTicket = _.clone(ticket);

                    if (targetTicket.bonus)
                        targetTicket.amount = parseInt(targetTicket.amount) + (targetTicket.amount * targetTicket.bonus.percentage);

                    targetService.deposit(targetTicket)
                        .then(function(response) {
                            callback(null, response);
                        })
                        .catch(function(error) {
                            callback(null, error);
                        })
                }
            },
            function(err, results) {

                self.logResultTransfer(err, results, ticket);

                // Rollback if one thread become fail
                if (!results.origin_result.result) {

                    targetService.withdrawn(ticket)
                        .then(function(response) {
                            return res.json(401, { error: 'Please, Try again!' });
                        })

                } else if (!results.target_result.result) {

                    originService.deposit(ticket)
                        .then(function(response) {
                            return res.json(401, { error: 'Please, Try again!' });
                        })

                    // Transfer success, update bonus type
                } else if (results.origin_result.result && results.target_result.result)
                    return self.updateBonusType(ticket, res);
            });
    },

    // Write log out all result form api
    logResultTransfer: function(err, results, ticket) {

        if (results) {
            Transfers.update({
                    id: ticket.id
                }, {
                    origin_result: JSON.stringify(results.origin_result),
                    target_result: JSON.stringify(results.target_result)
                })
                .then(function(result) {
                    console.log(result);
                })
        }
    },

    // Update bonus status
    updateBonusType: function(ticket, res) {

        // If member claim bonus
        if (ticket.bonus) {
            var bonusAmount = parseInt(ticket.amount) * ticket.bonus.percentage;
            rollingAmount = ticket.bonus.rolling_time * (parseInt(ticket.amount) + bonusAmount);

            grossApiGameService.getTurnOver(ticket.username, ticket.target)
                .then(function(turnOvers) {

                    var bonusLog = {
                        username: ticket.username,
                        transaction_id: ticket.id,
                        bonus_id: ticket.bonus.id,
                        turnover: turnOvers.data,
                        bonus_amount: bonusAmount,
                        rolling_amount: rollingAmount,
                        status: 'success',
                        process_by: 'auto'
                    };
                    return UserBonus.create(bonusLog);
                })
                .then(function(bonus) {console.log(bonus)
                    return res.json({ result: true });
                })
        } else
            return res.json({ result: true });
    }
};
