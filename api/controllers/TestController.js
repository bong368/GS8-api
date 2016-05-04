/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		bonusService.getTransferBonus(req.body.username)
			.then(function (bonus) {
				return res.json({bonus: bonus});
			})
		
	}
};

