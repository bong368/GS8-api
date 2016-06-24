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
        
        var self = this;

        async.parallel({

                "3D slots": function(callback) {

                    self.execCurl('http://img.gsoft88.net/gamelist.aspx?provider=gameplay')
                        .then(function(response) {
                            callback(null, response);
                        })
                        .catch(function(error) {
                            callback(null, error);
                        })
                },

                "R-slots": function(callback) {

                    self.execCurl('http://img.gsoft88.net/gamelist.aspx?provider=gameplayr')
                        .then(function(response) {
                            callback(null, response);
                        })
                        .catch(function(error) {
                            callback(null, error);
                        })
                }
            },
            function(err, results) {
                return res.json(results);
            })
    },

    authencation: function(req, res) {
        var query = req.query.ticket;
        console.log(query);
        tokenService.parse(query, true)
            .then(function(user) {
                var resp = {
                    error_code: 0,
                    cust_id: user.id,
                    cust_name: user.username,
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
    },

    execCurl: function(url) {
        return new promise(function(resolve, reject) {
            var curl = new Curl();
            parser = new xml2js.Parser({ explicitArray: false });

            curl.setOpt('URL', url);

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
                    return resolve(result.gamelist.game);
                });
                this.close();
            });

            curl.on('error', curl.close.bind(curl));
            curl.perform();
        })
    }
};
