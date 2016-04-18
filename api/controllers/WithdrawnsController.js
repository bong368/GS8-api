/**
 * WithdrawnController
 *
 * @description :: Server-side logic for managing withdrawns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Create new withdrawn ticket
     *
     * @param  res
     * @return req
     */
    create: function(req, res) {

        var ticket = req.body;
            cred = undefined;

        sailsTokenAuth.parseToken(req)
            .then(function(user) {
                cred = user;
                ticket.username = user.username;
       			return Withdrawns.create(ticket);
            })
            .catch(function (err) {
                return res.json(401, { error: 'Invalid token' });
            })
            .then(function (withdrawn) {
            	//
                return Users.update({
                    username: cred.username
                },{
                    main_balance: cred.main_balance - ticket.amount
                })
            })
            .then(function (user) {
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

       			return Withdrawns.find({
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
            .then(function (withdrawn) {
            	res.json(200, withdrawn);
            })
    }
};
