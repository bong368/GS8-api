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

    // Create new account WFT
    signup: function(user) {

        var parameter = {
            username: user.username,
            action: 'create',
            currency: user.currency
        }
        return execWftApi(parameter);
    },

    // Signin to WFT, API return a link to assign to iframe
    signin: function(username) {

        var parameter = {
            username: username,
            action: 'login',
            host: 'sport2.eg.1sgames.com',
            lang: 'EN-US'
        }
        return execWftApi(parameter);
    },

    // Get credit user from WFT
    getBalance: function(username) {

        var parameter = {
            username: username,
            action: 'balance'
        }
        return execWftApi(parameter);
    },

    deposit: function(username) {

        var parameter = {
            username: username,
            action: 'deposit',
            amount: 999999,
            serial: 0001
        }
        return execWftApi(parameter);
    },
};

var execWftApi = function(parameter) {
    return new promise(function(resolve, reject) {

        var curl = new Curl();
            parser = new xml2js.Parser({ explicitArray: false });
            credential = {
                secret: apiWft.secret,
                agent: apiWft.agent,
            }
            parameter = _.merge(parameter, credential);
            query = '?' + queryString.stringify(parameter);

        curl.setOpt('URL', apiWft.url + query);

        curl.on('end', function(statusCode, body, headers) {

            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                if (result.response.errcode == 0)
                    return resolve({
                        result: true,
                        data: result.response.result
                    });
                else
                    return resolve({
                        result: false,
                        error: result.response.errtext
                    });

            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    })
}
