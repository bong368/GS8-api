/**
 * BonusController
 *
 * @description :: Server-side logic for managing Bonuses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// get bonus for transfer function
	getTransferBonus: function (req, res) {
		tokenService.parse(req)
			.then(function (user) {
				return bonusService.getTransferBonus(user.username);
			})
			.then(function (bonus) {
				return res.json({data: bonus});
			})
	}
};

