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
    },

    updatePassword: function (req, res) {
        var user = undefined;
        tokenService.parse(req)
            .then(function(cred) {
                user = cred;
                return CredentialAllBet.findOne({username: user.username});
            })
            .then(function (allBet) {console.log(allBet);
                if (allBet) {
                    return CredentialAllBet.update({username: user.username}, {password: req.body.password});
                } else {
                    return CredentialAllBet.create({username: user.username, password: req.body.password});
                }
            })
            .then(function (argument) {
                var cred = {
                    username: user.username,
                    password: req.body.password
                };
                return allBetService.updatePassword(cred);
            })
            .then(function (result) {
                if (result) {
                    return res.json({result: result});
                }
            })
    }
};
