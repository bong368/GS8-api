/**
 * LimitTransactionController
 *
 * @description :: Server-side logic for managing Limittransactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		LimitTransaction.find(function (err, limit) {
			if (err) {
				return res.json(401, { err: err });
			}
			return res.json(200, {data: limit[0]});
		})
	},
};

