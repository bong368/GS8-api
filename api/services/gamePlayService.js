/**
 * Sportsbook GamePlay Service
 *
 * @description :: Server-side logic for managing GamePlay API
 */
var Curl = require('node-libcurl').Curl;
md5 = require('md5');
xml2js = require('xml2js');
queryString = require('query-string');
promise = require('bluebird');
apiGamePlay = {
    title: 'GamePlay',
    url: 'http://api.pt.gsoft88.net/VMSWservices.aspx',
    agent: 'HOKIBET188',
    secret: 'F502E0A6-2927-4573-8E2A-281294FCA849',
    signinHost: 'login.pt.gsoft88.net'
}

module.exports = {

    // Create new account GamePlay
    signup: function(user) {

        var parameter = {
            cust_name: user.username,
            cust_id: user.id
        }
        apiGamePlay.url = 'https://club8api.w88.com/op/createuser';

        return execGamePlayApi(parameter);
    },

    createAnonymous: function() {
        var parameter = {
            cust_name: 'anonymous',
            cust_id: 'anonymous',
            test_cust: true
        }
        apiGamePlay.url = 'https://club8api.w88.com/op/createuser';

        return execGamePlayApi(parameter);
    },

    // Signin to GamePlay, API return a link to assign to iframe
    signin: function(username, password, gameCode) {
        var parameter = {
            username: username + '@HOKI',
            password: password,
            gamecode: gameCode,
            langcode: 'en',
        }
        console.log(parameter);
        apiGamePlay.url = 'http://login.pt.gsoft88.net/createurl.aspx';

        return execGamePlayApi(parameter);
    },

    // Signout to GamePlay
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
        }
        return execGamePlayApi(parameter);
    },

    // Get credit user from GamePlay
    getBalance: function(username) {
        return Users.findOne({ username: username })
            .then(function(user) {
                var parameter = {
                    cust_id: user.id,
                    method: "CheckBalance"
                }
                apiGamePlay.url = 'https://club8api.w88.com/op/getbalance';
                return execGamePlayApi(parameter);
            })

    },

    // Deposit to GamePlay
    deposit: function(ticket) {
        return Users.findOne({ username: ticket.username })
            .then(function(user) {
                var parameter = {
                    cust_id: user.id,
                    amount: ticket.amount,
                    trx_id: ticket.id
                }
                apiGamePlay.url = 'https://club8api.w88.com/op/credit';

                return execGamePlayApi(parameter);
            })
    },

    // Withdrawn to GamePlay
    withdrawn: function(ticket) {

        return Users.findOne({ username: ticket.username })
            .then(function(user) {
                var parameter = {
                    cust_id: user.id,
                    amount: ticket.amount,
                    trx_id: ticket.id
                }
                apiGamePlay.url = 'https://club8api.w88.com/op/debit';

                return execGamePlayApi(parameter);
            })
    },

    // Return title of game
    getTitle: function() {
        return apiGamePlay.title;
    },

    // Get turnover
    getTurnOver: function(username, agent, dateFrom) {
        console.log(dateFrom);
        return new promise(function(resolve, reject) {

            var curl = new Curl(),
                url = 'http://128.199.77.130:1337/api/betting/GamePlay/turnover',
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

                console.log("\n *** Get GamePlay turnover: ".green + sails.moment(new Date()).format('YYYY-MM-DD HH:mm:ss').green);
                console.log(body);

                var result = JSON.parse(body);
                return resolve({
                    result: true,
                    title: apiGamePlay.title,
                    data: result.turnOver
                });

                this.close();
            });

            curl.on('error', curl.close.bind(curl));
        })
    },

    getPassword: function(username) {
        return new promise(function(resolve, reject) {
            CredentialGamePlay.findOne({ username: username })
                .then(function(GamePlay) {
                    if (GamePlay) {
                        return resolve(GamePlay.password);
                    } else {
                        Users.findOne({ username: username })
                            .then(function(cred) {
                                return resolve(md5(cred.password));
                            })
                    }
                })
        })
    }
};

var execGamePlayApi = function(parameter) {
    return new promise(function(resolve, reject) {

        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });
        credential = {
            merch_id: apiGamePlay.agent,
            merch_pwd: apiGamePlay.secret,
            currency: 'IDR'
        }
        parameter = _.merge(parameter, credential);
        query = '?' + queryString.stringify(parameter);
        console.log(queryString.stringify(parameter));
        curl.setOpt('URL', apiGamePlay.url + query);

        curl.on('end', function(statusCode, body, headers) {
            console.log(body);
            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                if (result.resp.error_code == 0)
                    return resolve({
                        result: true,
                        title: apiGamePlay.title,
                        data: adapterCurlResult(result.resp, parameter.method)
                    });
                else
                    return resolve({
                        result: false,
                        title: apiGamePlay.title,
                        error: result.resp.error_msg
                    });

            });
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
        return (result.balance);
    },
    deposit: function(result) {
        return result.Deposit.amount;
    },
    withdraw: function(result) {
        return result.Withdraw.amount;
    }
}
