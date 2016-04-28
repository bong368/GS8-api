/**
 * WftController
 *
 * @description :: Server-side logic for managing Wfts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    signin: function(req, res) {
        tokenService.parse(req)
            .then(function(user) {
                return wftService.signin(user.username)
            })
            .catch(function (error) {
            	return wftService.anonymousMode();
            })
	        .then(function(result) {
	            return res.json(200, {data : result});
	        })
	        .catch(function (error) {
	        	return res.json(200, {error : error});
	        })
    }
};
