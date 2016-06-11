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

    // Signout to WFT
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
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
        return apiWft.title;
    },

    getTurnOver: function(username, agent, dateFrom) {
        console.log(dateFrom);
        return new promise(function(resolve, reject) {

            var curl = new Curl(),
                url = 'ag.hokibet188.com/api/public/index.php/callApi/wft-turnover',
                data = {
                    username: username,
                    agent: agent,
                    dateFrom: sails.moment(dateFrom).utcOffset("+08:00").format('YYYY-MM-DD HH:mm:ss'),
                    dateTo: sails.moment(new Date()).utcOffset("+08:00").format('YYYY-MM-DD HH:mm:ss')
                };

            console.log("\n *** TurnOver ticket: ".green + sails.moment(new Date()).format('YYYY-MM-DD HH:mm:ss').green);
            console.log(data);

            data = queryString.stringify(data);

            curl.setOpt(Curl.option.URL, url);
            curl.setOpt(Curl.option.POSTFIELDS, data);

            curl.perform();

            curl.on('end', function(statusCode, body) {

                console.log("\n *** Get WFT turnover: ".green + sails.moment(new Date()).format('YYYY-MM-DD HH:mm:ss').green);
                console.log(body);

                var result = JSON.parse(body);
                return resolve({
                    result: true,
                    title: apiWft.title,
                    data: result.turnover
                });

                this.close();
            });

            curl.on('error', curl.close.bind(curl));
        })
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
        console.log(queryString.stringify(parameter));
        curl.setOpt('URL', apiWft.url + query);

        curl.on('end', function(statusCode, body, headers) {
            console.log(body);
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                if (result.response.errcode == 0)
                    return resolve({
                        result: true,
                        title: apiWft.title,
                        data: adapterCurlResult(result.response.result, parameter.method)
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

var adapterCurlResult = function(result, method) {
    if (method == 'getTurnOver') {
        return getTurnOver(result.ticket);
    } else
        return result;
}

// Calculate Turn Over
var getTurnOver = function(ticket) {
    var turnOver = 0;

    _.forEach(ticket, function(value, key) {
        turnOver += parseInt(value.a);
    });

    return turnOver;
}
