/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing WFT API
 */

var Curl = require('node-libcurl').Curl;
    xml2js = require('xml2js');
    queryString = require('query-string');
    api = 'http://hapi.bm.1sgames.com/api.aspx';

module.exports = {

    register: function(req, res, username) {

        var curl = new Curl();
            parser = new xml2js.Parser();
            query = {
                secret: '9tkf9kdkdf',
                agent: 'p@yq',
                username: username,
                action: 'create',
                currency: 'IDR'
            }
            query = '?' + queryString.stringify(query);
            
        curl.setOpt('URL', api + query);

        curl.on('end', function(statusCode, body, headers) {

            parser.parseString(xml, function(err, result) {
                console.log(result);
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    },

    login: function(req, res, username) {

        var curl = new Curl();
            parser = new xml2js.Parser();
            query = {
                secret: '9tkf9kdkdf',
                agent: 'p@yq',
                username: username,
                action: 'login',
                host: 'sport2.eg.1sgames.com',
                lang: 'EN-US'
            }
            query = '?' + queryString.stringify(query);
            
        curl.setOpt('URL', api + query);

        curl.on('end', function(statusCode, body, headers) {
            
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                console.log(result);
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    },

    getBalance: function (req, res, username) {
        
        var curl = new Curl();
            parser = new xml2js.Parser();
            query = {
                secret: '9tkf9kdkdf',
                agent: 'p@yq',
                username: username,
                action: 'balance'
            }
            query = '?' + queryString.stringify(query);
            
        curl.setOpt('URL', api + query);

        curl.on('end', function(statusCode, body, headers) {
            
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                console.log(result);
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    }
};
