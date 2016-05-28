/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		allBetService.queryHandicap();
			
		
	},

	wftSignout: function (req, res) {
		wftService.signout('tester')
			.then(function (bonus) {
				return res.json({bonus: bonus});
			})
		
	},

	signUpGSoft: function (req, res) {
		gSoftService.getBalance('tester')
			.then(function (user) {
				return res.json({data: user});
			})
		
	},

	updatePassGameTech: function (req, res) {
		gSoftService.updatePassword({username: 'tester', password: '$2a$10$hzSfB9pT/u3eF40IwUMC6uOFubU0jDCtxqRrQr2GSlYax06Mw8/GS'})
			.then(function (user) {
				return res.json({data: user});
			})
		
	}


};

