/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	playGame: function (req, res) {
		res.locals.layout = 'iframeLayout/layout';
    	return res.view('iframeLayout/main');
	}
};

