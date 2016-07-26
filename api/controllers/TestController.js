/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
var soap = require('soap');

module.exports = {
    test: function(req, res) {
        var url = 'https://entservices.totalegame.net/?wsdl';
        console.log(url);
        soap.createClient(url, function(err, client) {
            if (err) throw err;
            client.describe();
        });


    },

    queryHandicap: function(req, res) {
        var options = {
            from: new Date - 24 * 60 * 60 * 1000,
            until: new Date,
            limit: 10,
            start: 0,
            order: 'desc',
            fields: ['message'],
            level: 'debug'
        };

        //
        // Find items logged between today and yesterday.
        //
        logger.query(options, function(err, results) {
            if (err) {
                throw err;
            }
            console.log(results);
            return res.json(results);
        });
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

        defer.then(function(data) {
            return res.json({ data: data });
        })
    }


};
