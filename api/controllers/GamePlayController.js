/**
 * GamePlayController
 *
 * @description :: Server-side logic for managing Gameplays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
var js2xmlparser = require("js2xmlparser");
module.exports = {
    createAnonymous: function(req, res) {
        gamePlayService.anonymous()
            .then(function(result) {
                return res.json(result);
            })
    },

    getAllGame: function(req, res) {
        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });

        curl.setOpt('URL', 'http://img.gsoft88.net/gamelist.aspx?provider=gameplay');

        curl.on('end', function(statusCode, body, headers) {

            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                _.forEach(result.gamelist.game, function(value, key) {
                    result.gamelist.game[key] = {
                        GameName: value.GameName,
                        Image: value.Image,
                        GameCode: value.GameCode,
                    }
                });
                return res.json(result.gamelist.game);
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    },

    authencation: function(req, res) {
        var query = req.query.ticket;
        console.log(query);
        tokenService.parse(query, true)
            .then(function(user) {
                var resp = {
                    error_code: 0,
                    cust_id: user.id,
                    cust_name: user.id,
                    currency_code: user.currency,
                    language: 'en-us',
                    test_cust: false,
                    country: 'ID',
                    date_of_birth: '29-09-1989',
                    ip: '127.0.0.1'
                };
                var result = js2xmlparser("resp", resp);
                res.setHeader("Content-type", "text/xml");
                res.send(result);
                console.log(result);
            })
    }
};
