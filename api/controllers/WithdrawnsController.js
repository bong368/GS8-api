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

        sailsTokenAuth.parseToken(req)
            .then(function(user) {
                ticket.username = user.username;
       			return Withdrawns.create(ticket);
            })
            .catch(function (err) {
                return res.json(401, { error: 'Invalid token' });
            })
            .then(function (withdrawn) {
            	res.json(200, { result: true });
            })
    }
};
