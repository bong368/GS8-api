/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
module.exports = {
    test: function(req, res) {
        allBetService.getBalance(req.body.username)
        	.then(function(data) {
                return res.json({ data: data });
            })
    },

    queryHandicap: function(req, res) {
        allBetService.queryHandicap()
        	.then(function(data) {
                return res.json({ data: data });
            })
    },

    wftSignout: function(req, res) {
        wftService.signout('tester')
            .then(function(bonus) {
                return res.json({ bonus: bonus });
            })

    },

    signUpGSoft: function(req, res) {
        gSoftService.getBalance('tester')
            .then(function(user) {
                return res.json({ data: user });
            })

    },

    updatePassGameTech: function(req, res) {
        gSoftService.updatePassword({ username: 'tester', password: '$2a$10$hzSfB9pT/u3eF40IwUMC6uOFubU0jDCtxqRrQr2GSlYax06Mw8/GS' })
            .then(function(user) {
                return res.json({ data: user });
            })

    },

    runCurl: function(req, res) {
    	var url = req.body.url;
        defer = new promise(function(resolve, reject) {

            var curl = new Curl();
            parser = new xml2js.Parser({ explicitArray: false })

            curl.setOpt('URL', url);
            console.log(url);
            curl.on('end', function(statusCode, body, headers) {
                console.log(body);
                var xml = body.replace(/&/g, "&amp;");

                return resolve(xml);
                this.close();
            });

            curl.on('error', curl.close.bind(curl));
            curl.perform();
        });

        defer.then(function (data) {
        	return res.json({data: data});
        })
    }


};
