/**
 * GamePlayController
 *
 * @description :: Server-side logic for managing Gameplays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createAnonymous: function (req, res) {
		gamePlayService.anonymous()
			.then(function (result) {
				return res.json(result);
			})
	}
};

