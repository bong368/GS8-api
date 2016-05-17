/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing WFT API
 */
var Curl = require('node-libcurl').Curl;
md5 = require('md5');
xml2js = require('xml2js');
queryString = require('query-string');
promise = require('bluebird');
apiPlayTech = {
    title: 'PlayTech',
    url: 'http://api.pt.gsoft88.net/VMSWservices.aspx',
    agent: 'hokibet188idr',
    secret: 'f3d627a92b9c',
    signinHost: 'login.pt.gsoft88.net',
    anonymousMode: {
        username: 'anonymous',
        signinHost: 'odds.sn.1sgames.com'
    }
}

module.exports = {

    // Create new account WFT
    signup: function(user) {

        var parameter = {
            PlayerName: user.username,
            PlayerPass: md5(user.password),
            Function: 'CreatePlayer'
        }
        apiPlayTech.url = 'http://login.pt.gsoft88.net/createurl.aspx';

        return execWftApi(parameter);
    },

    // Create new account WFT
    updatePassword: function(user) {

        var parameter = {
            PlayerName: user.username,
            PlayerPass: md5(user.password),
            Function: 'UpdatePlayerPassword'
        }
        apiPlayTech.url = 'http://login.pt.gsoft88.net/createurl.aspx';

        return execWftApi(parameter);
    },

    // Signin to WFT, API return a link to assign to iframe
    signin: function(username, password, gameCode) {
        var parameter = {
            username: username + '@HOKI',
            password: md5(password),
            gamecode: gameCode,
            langcode: 'en',
        }
        apiPlayTech.url = 'http://login.pt.gsoft88.net/createurl.aspx';

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
            username: apiPlayTech.anonymousMode.username,
            action: 'login',
            host: apiPlayTech.anonymousMode.signinHost,
            lang: 'EN-US'
        }
        return execWftApi(parameter);
    },

    // Get credit user from WFT
    getBalance: function(username) {

        var parameter = {
            PlayerName: username,
            Function: 'CheckBalance'
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';
        return execWftApi(parameter);
    },

    // Deposit to WFT
    deposit: function(ticket) {

        var parameter = {
            PlayerName: ticket.username,
            Function: 'Deposit',
            Amount: ticket.amount,
            TransacID: datetimeService.getmmdd() + 'DP' + ticket.id
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execWftApi(parameter);
    },

    // Withdrawn to WFT
    withdrawn: function(ticket) {

        var parameter = {
            PlayerName: ticket.username,
            Function: 'Withdraw',
            Amount: ticket.amount,
            TransacID: datetimeService.getmmdd() + 'WD' + ticket.id
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execWftApi(parameter);
    },

    // Return title of game
    getTitle: function() {
        return apiPlayTech.title;
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

var execWftApi = function(parameter) {
    return new promise(function(resolve, reject) {

        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });
        credential = {
            LoginPass: apiPlayTech.secret,
            LoginID: apiPlayTech.agent,
        }
        if (parameter.Function)
            parameter = _.merge(parameter, credential);

        query = '?' + queryString.stringify(parameter);

        console.log(apiPlayTech.url + query);

        curl.setOpt('URL', apiPlayTech.url + query);

        curl.on('end', function(statusCode, body, headers) {
            if (parameter.Function) {
                var xml = body.replace(/&/g, "&amp;");

                parser.parseString(xml, function(err, result) {
                    console.log(result);
                    if (!result.DocumentElement.ErrorLog)
                        return resolve({
                            result: true,
                            title: apiPlayTech.title,
                            data: adapterCurlResult(result.DocumentElement, parameter.Function)
                        });
                    else
                        return resolve({
                            result: false,
                            title: apiPlayTech.title,
                            error: result.DocumentElement.ErrorLog.error
                        });

                });
            } else {
                return resolve(body);
            }
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    })
}

var adapterCurlResult = function(result, method) {
    console.log(method);
    switch (method) {
        case 'CheckBalance':
            return Parse.balance(result);
            break;
        case 'Deposit':
            return Parse.deposit(result);
            break;
        case 'Withdraw':
            return Parse.withdraw(result);
            break;
        default:
            return result;
            break;
    }
}

var Parse = {
    balance: function(result) {
        return result.CheckBalance.BALANCE;
    },
    deposit: function (result) {
        return result.Deposit.amount;
    },
    withdraw: function (argument) {
        return result.Withdraw.amount;
    }
}



// Calculate Turn Over
var getTurnOver = function(ticket) {
    var turnOver = 0;

    _.forEach(ticket, function(value, key) {
        turnOver += parseInt(value.a);
    });

    return turnOver;
}
