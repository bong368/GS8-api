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
    title: 'WFT Sportsbook',
    url: 'http://hapi.bm.1sgames.com/api.aspx',
    agent: 'p@yq',
    secret: '9tkf9kdkdf',
    signinHost: 'sport2.eg.1sgames.com',
    anonymousMode: {
        username: 'anonymous',
        signinHost: 'odds.sn.1sgames.com'
    }
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
            host: apiWft.signinHost,
            lang: 'EN-US'
        }
        return execWftApi(parameter);
    },

    // Signin with default account (anonymous)
    anonymousMode: function() {
        var parameter = {
            username: apiWft.anonymousMode.username,
            action: 'login',
            host: apiWft.anonymousMode.signinHost,
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

    // Deposit to WFT
    deposit: function(ticket) {

        var parameter = {
            username: ticket.username,
            action: 'deposit',
            amount: ticket.amount,
            serial: getDateNow + '_' + ticket.id
        }
        console.log(parameter);
        return execWftApi(parameter);
    },

    // Withdrawn to WFT
    withdrawn: function(ticket) {

        var parameter = {
            username: ticket.username,
            action: 'withdraw',
            amount: ticket.amount,
            serial: ticket.id
        }
        return execWftApi(parameter);
    },

    // Return title of game
    getTitle: function() {
        return apiWft.title;
    }
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
            //console.log(body);
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                if (result.response.errcode == 0)
                    return resolve({
                        result: true,
                        title: apiWft.title,
                        data: result.response.result
                    });
                else
                    return resolve({
                        result: false,
                        title: apiWft.title,
                        error: result.response.errtext
                    });

            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    })
}

var getDateNow = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + dd ;
}
