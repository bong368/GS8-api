/**
 * GamePlayController
 *
 * @description :: Server-side logic for managing Gameplays
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
var url = require('url');
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

    signin: function(req, res) {
        gamePlayService.signin(req.body.gameCode, req.headers.authorization)
            .then(function(result) {
                console.log(result);
                return res.json(200, { data: result });
            })
            .catch(function(error) {
                return res.json(200, { error: error });
            })
    },

    authencation: function(req, res) {
        var query = url.parse(req.url, true).query;
        tokenService.parse(query.ticket)
            .then(function(user) {
                var resp = {
                    error_code: 0,
                    cust_id: user.id,
                    cust_name: user.id,
                    currency_code: user.currency,
                    language: 'en-us',
                    test_cust: false,
                    country: 'USA'
                    date_of_birth: '29-09-1989',
                    ip: '1.2.3.4'
                };
                var result = js2xmlparser("resp", resp);
                res.setHeader("Content-type", "text/xml");
                res.send(result);
            })
    }
};
