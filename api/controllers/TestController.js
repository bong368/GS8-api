/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	test: function (req, res) {
		wftService.signup({username: 'anonymous', currency: 'IDR'})
		.then(function (result) {
			res.json(result);
			
		})
		
	}
};

