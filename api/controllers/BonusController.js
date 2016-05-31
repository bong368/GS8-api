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
	},

	getDepositBonus: function (req, res) {
		tokenService.parse(req)
			.then(function (user) {
				return bonusService.getDepositBonus(user.username);
			})
			.then(function (bonus) {
				return res.json({data: bonus});
			})
	},

	getUserBonus: function (req, res) {
		tokenService.parse(req)
			.then(function (user) {console.log(user);
				return UserBonus.find({username: user.username}).populate('bonus_id')
			})
			.then(function (bonus) {console.log(bonus);
				return res.json(bonus);
			})
	}
};

