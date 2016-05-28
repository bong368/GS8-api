/**
 * WftController
 *
 * @description :: Server-side logic for managing AllBet
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    signin: function(req, res) {
        tokenService.parse(req)
            .then(function(user) {
                return allBetService.signin(user.username)
            })
            .catch(function (error) {
            	return allBetService.anonymousMode();
            })
	        .then(function(result) {
	            return res.json(200, {data : result.data});
	        })
	        .catch(function (error) {
	        	return res.json(200, {error : error});
	        })
    }
};
