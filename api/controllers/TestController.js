/**
 * TestController
 *
 * @description :: Server-side logic for managing Tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
var winston = require('winston');
var logger = new(winston.Logger)({
    level: 'debug',
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({ filename: 'log/test.json' })
    ]
});
module.exports = {
    test: function(req, res) {
        logger.info('Test Log Message', {
            anything: 'This is metadata',
            text: "test",
            text: "OK"
        });
        logger.info('Hello again distributed logs');

        return res.json({ result: 200 });
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
