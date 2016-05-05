/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		grossApiGameService.getTurnOver('tester')
			.then(function (bonus) {
				return res.json({bonus: bonus});
			})
		
	}
};

