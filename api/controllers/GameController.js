/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getTitle: function (req, res) {
		res.json(200, grossApiGameService.getTitle());
	}
};

