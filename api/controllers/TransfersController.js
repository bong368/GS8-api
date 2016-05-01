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
        var ticket = requestService.only(['origin', 'target', 'amount'], req);
        tokenService.parse(req)
            .then(function(user) {
                var credential = {
                    username: user.username,
                    currency: user.currency
                }
                ticket = _.merge(ticket, credential);
                return Transfers.create(ticket);
            })
            .then(function(ticket) {
                console.log(ticket);
                var originService = grossApiGameService.getServiceFromName(ticket.origin);
                targetService = grossApiGameService.getServiceFromName(ticket.target);

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
                        // Sync Accoount
                        target_result: function(callback) {
                            targetService.deposit(ticket)
                                .then(function(response) {
                                    callback(null, response);
                                })
                                .catch(function(error) {
                                    callback(null, error);
                                })
                        }
                    },
                    function(err, results) {

                    	// Rollback if one thread become fail
                        if (!results.origin_result.result) {
                            targetService.withdrawn(ticket)
                                .then(function(response) {
                                    return res.json(401, {error: 'Please, Try again!'});
                                })
                        } else if (!results.target_result.result) {
                            originService.deposit(ticket)
                                .then(function(response) {
                                    return res.json(401, {error: 'Please, Try again!'});
                                })
                        } else
                        	return res.json(200, results);
                    });
            })
    }
};
