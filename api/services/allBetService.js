/**
 * AllBet Service
 *  agent=vm237a&random=23534621425&propertyId=8066995'
 * @description :: Server-side logic for managing WFT API
 */
var Curl = require('node-libcurl').Curl;
xml2js = require('xml2js');
queryString = require('query-string');
promise = require('bluebird');
apiAllBet = {
    title: 'AllBet Casino',
    url: 'https://api3.abgapi.net/',
    agent: 'vm237a',
    propertyId: '8066995'
}

module.exports = {

    test: function(argument) {
        /* body... */
    },

    queryHandicap: function() {
        var parameter = {
            agent: apiAllBet.agent,
            random: Math.floor(Date.now() / 1000)
        }
        encryptAPI(parameter)
            .then(function(result) {
                var parameter = {
                    data: result.data.data,
                    sign: result.data.sign,
                    propertyId: apiAllBet.propertyId,
                    method: 'query_handicap'
                }
                return execAllBetApi(parameter);
            })
    },

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
            host: apiAllBet.signinHost,
            lang: 'EN-US'
        }
        return execWftApi(parameter);
    },

    // Signout to WFT
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
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
            serial: datetimeService.getmmdd() + 'DP' + ticket.id
        }
        return execWftApi(parameter);
    },

    // Withdrawn to WFT
    withdrawn: function(ticket) {

        var parameter = {
            username: ticket.username,
            action: 'withdraw',
            amount: ticket.amount,
            serial: datetimeService.getmmdd() + 'WD' + ticket.id
        }
        return execWftApi(parameter);
    },

    // Return title of game
    getTitle: function() {
        return apiAllBet.title;
    },

    // Get turnover
    getTurnOver: function(username) {
        var parameter = {
            username: username,
            action: 'fetch',
            method: 'getTurnOver'
        }
        return execWftApi(parameter);
    }
};

var execAllBetApi = function(parameter) {
    return new promise(function(resolve, reject) {

        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });

        query = '?' + queryString.stringify(parameter);

        curl.setOpt('URL', apiAllBet.url + parameter.method + query);
        console.log(apiAllBet.url + query);
        curl.on('end', function(statusCode, body, headers) {
            console.log(body);
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                // if (result.response.errcode == 0)
                //     return resolve({
                //         result: true,
                //         title: apiAllBet.title,
                //         data: adapterCurlResult(result.response.result, parameter.method)
                //     });
                // else
                //     return resolve({
                //         result: false,
                //         title: apiAllBet.title,
                //         error: result.response.errtext
                //     });

            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    })
}

var encryptAPI = function(data) {
    return new promise(function(resolve, reject) {

        var curl = new Curl(),
            url = 'http://ag.hokibet188.com/api/public/index.php/callApi/encrypt',
            query = {
                plain_text: queryString.stringify(data)
            };
        query = queryString.stringify(query);
        console.log(query);
        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.POSTFIELDS, query);
        curl.setOpt(Curl.option.HTTPHEADER, ['User-Agent: node-libcurl/1.0']);
        curl.setOpt(Curl.option.VERBOSE, true);

        curl.perform();

        curl.on('end', function(statusCode, body) {
            console.log(body);
            var result = JSON.parse(body);
            return resolve({
                result: true,
                data: result
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
    })
}
