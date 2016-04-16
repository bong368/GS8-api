/**
 * BankingController
 *
 * @description :: Server-side logic for managing bankings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		Banking.find(function (err, bankings) {
			if (err) {
				console.log(err);
				return res.json(401, { err: err });
			}
			return res.json(200, {data: bankings});
		})
	},
};

