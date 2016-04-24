/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		wftService.register(req, res, 'tester')
		.then(function (result) {
			console.log(result);
			return res.json(401, result);
		})
		
	}
};

