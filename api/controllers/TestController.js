/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		sportsbookWftService.getBalance(req, res, 'tester');
		return res.json(401, { result: 'view on console' });
	}
};

