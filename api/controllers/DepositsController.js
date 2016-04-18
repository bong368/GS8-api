/**
 * DepositController
 *
 * @description :: Server-side logic for managing Deposits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Create new deposit ticket
     *
     * @param  res
     * @return req
     */
    create: function(req, res) {

        var ticket = req.body;
        ticket.extra_bonus = true ? 1 : 0;

        sailsTokenAuth.parseToken(req)
            .then(function(user) {
                ticket.username = user.username;
       			return Deposits.create(ticket);
            })
            .catch(function (err) {
                return res.json(401, { error: 'Invalid token' });
            })
            .then(function (deposit) {
            	res.json(200, { result: true });
            })
    },

    /**
     * List all new deposit ticket
     *
     * @param  res
     * @return req
     */
    index: function(req, res) {

    	var ticket = req.body;
        
    	sailsTokenAuth.parseToken(req)
            .then(function(user) {

       			return Deposits.find({
       				where: {
	       				username: user.username,
	       				created_at: { 
	       					'>=': new Date(ticket.date_from + ' 00:00:00.000'), 
	       					'<=': new Date(ticket.date_to + ' 23:59:59.997')
	       				}
	       			},
	       			sort: 'created_at DESC'
       			});
            })
            .catch(function (err) {
                return res.json(401, { error: 'Invalid token' });
            })
            .then(function (deposits) {
            	res.json(200, deposits);
            })
    }
};
