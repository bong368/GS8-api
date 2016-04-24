/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing WFT API
 */
var Curl = require('node-libcurl').Curl;
    xml2js = require('xml2js');
    queryString = require('query-string');
    promise = require('bluebird');
    apiWft = {
        url: 'http://hapi.bm.1sgames.com/api.aspx',
        agent: 'p@yq',
        secret: '9tkf9kdkdf'
    }

module.exports = {

    // Create one new account for WFT
    signup: function(req, res, username) {

        return new promise(function(resolve, reject) {
            var curl = new Curl();
                parser = new xml2js.Parser({explicitArray: false});
                query = {
                    secret: apiWft.secret,
                    agent: apiWft.agent,
                    username: username,
                    action: 'create',
                    currency: 'IDR'
                }
                query = '?' + queryString.stringify(query);
                
            curl.setOpt('URL', apiWft.url + query);

            curl.on('end', function(statusCode, xml, headers) {

                // Xml to string
                parser.parseString(xml, function(err, result) {
                    return resolve(result);
                });
                this.close();
            });

            curl.on('error', curl.close.bind(curl));
            curl.perform();
        })
    },

    // Signin to WFT, API return a link to assign to iframe
    signin: function(req, res, username) {

        return new promise(function(resolve, reject) {
            var curl = new Curl();
                parser = new xml2js.Parser({explicitArray: false});
                query = {
                    secret: apiWft.secret,
                    agent: apiWft.agent,
                    username: username,
                    action: 'login',
                    host: 'sport2.eg.1sgames.com',
                    lang: 'EN-US'
                }
                query = '?' + queryString.stringify(query);
                
            curl.setOpt('URL', apiWft.url + query);

            curl.on('end', function(statusCode, body, headers) {
                
                var xml = body.replace(/&/g, "&amp;");

                parser.parseString(xml, function(err, result) {
                    
                    if (result.response.errcode == 0)
                        return resolve(result.response.result);
                    else
                        return reject(result.response.errtext)

                });
                this.close();
            });

            curl.on('error', curl.close.bind(curl));
            curl.perform();
        })
    },

    // Get credit user from WFT
    getBalance: function (req, res, username) {
        
        return new promise(function(resolve, reject) {
            var curl = new Curl();
                parser = new xml2js.Parser();
                query = {
                    secret: apiWft.secret,
                    agent: apiWft.agent,
                    username: username,
                    action: 'balance'
                }
                query = '?' + queryString.stringify(query);
                
            curl.setOpt('URL', apiWft.url + query);

            curl.on('end', function(statusCode, xml, headers) {

                parser.parseString(xml, function(err, result) {
                    return resolve(result);
                });
                this.close();
            });

            curl.on('error', curl.close.bind(curl));
            curl.perform();
        })
    }
};
