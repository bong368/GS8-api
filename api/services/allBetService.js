/**
 * AllBet Service
 *  agent=vm237a&random=23534621425&propertyId=8066995'
 * @description :: Server-side logic for managing AllBet API
 */
var Curl = require('node-libcurl').Curl;
md5 = require('md5');
queryString = require('query-string');
promise = require('bluebird');
apiAllBet = {
    title: 'AllBet Casino',
    url: 'https://api3.abgapi.net/',
    agent: 'vm237a',
    propertyId: '8066995'
}

module.exports = {

    queryHandicap: function() {
        var parameter = {};
        return encryptAPI(parameter)
            .then(function(result) {
                var parameter = {
                    data: result.data.data,
                    sign: result.data.sign,
                    method: 'query_handicap'
                }
                return execAllBetApi(parameter);
            })
    },

    // Create new account AllBet
    signup: function(user) {

        var parameter = {
            client: user.username,
            password: md5(user.password).substring(0, 11),
            vipHandicaps: 12,
            orHandicaps: 11,
            orHallRebate: 0
        };
        return encryptAPI(parameter)
            .then(function(result) {
                var parameter = {
                    data: result.data.data,
                    sign: result.data.sign,
                    method: 'check_or_create'
                }
                return execAllBetApi(parameter);
            })
    },

    // Signin to AllBet, API return a link to assign to iframe
    signin: function(username) {

        var parameter = {
            agent: apiAllBet.agent,
            random: Math.floor(Date.now() / 1000)
        }
        return encryptAPI(parameter)
            .then(function(result) {
                var parameter = {
                    data: result.data.data,
                    sign: result.data.sign,
                    propertyId: apiAllBet.propertyId,
                    method: 'check_or_create'
                }
                return execAllBetApi(parameter);
            })
    },

    // Signout to AllBet
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
        }
        return execWftApi(parameter);
    },

    // Get credit user from AllBet
    getBalance: function(username) {

        var parameter = {
            client: username
        };
        return this.getPassword(username)
            .then(function (password) {
                parameter.password = password;
                return encryptAPI(parameter);
            })
        
            .then(function(result) {
                var parameter = {
                    data: result.data.data,
                    sign: result.data.sign,
                    method: 'get_balance'
                }
                return execAllBetApi(parameter);
            })
    },

    // Deposit to AllBet
    deposit: function(ticket) {

        var parameter = {
            username: ticket.username,
            action: 'deposit',
            amount: ticket.amount,
            serial: datetimeService.getmmdd() + 'DP' + ticket.id
        }
        return execWftApi(parameter);
    },

    // Withdrawn to AllBet
    withdrawn: function(ticket) {

        var parameter = {
            username: ticket.username,
            action: 'withdraw',
            amount: ticket.amount,
            serial: datetimeService.getmmdd() + 'WD' + ticket.id
        }
        return execWftApi(parameter);
    },

    getPassword: function(username) {
        return new promise(function(resolve, reject) {
            
            Users.findOne({ username: username })
                .then(function(cred) {
                    return resolve(md5(cred.password).substring(0, 11));
                })      
        })
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
        method = parameter.method;
        delete parameter.method;
        parameter.propertyId = apiAllBet.propertyId;

        query = '?' + queryString.stringify(parameter);

        curl.setOpt('URL', apiAllBet.url + method + query);
        curl.on('end', function(statusCode, body, headers) {
            console.log(body);
            var result = JSON.parse(body);
            if (result.error_code === 'OK')
                return resolve({
                    result: true,
                    title: apiAllBet.title,
                    data: adapterCurlResult(result, method)
                });
            else
                return resolve({
                    result: false,
                    title: apiAllBet.title,
                    error: result.message
                });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    })
}

var encryptAPI = function(data) {
    return new promise(function(resolve, reject) {
        credential = {
            random: Math.floor(Date.now() / 1000),
            agent: apiAllBet.agent,
        }
        data = _.merge(data, credential);
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

var adapterCurlResult = function(result, method) {
    console.log(method);
    switch (method) {
        case 'get_balance':
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