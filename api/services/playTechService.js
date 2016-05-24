/**
 * Sportsbook playTech Service
 *
 * @description :: Server-side logic for managing playTech API
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
    signinHost: 'login.pt.gsoft88.net'
}

module.exports = {

    // Create new account playTech
    signup: function(user) {

        var parameter = {
            PlayerName: user.username,
            PlayerPass: md5(user.password),
            Function: 'CreatePlayer'
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execplayTechApi(parameter);
    },

    // Create new account playTech
    updatePassword: function(user) {

        var parameter = {
            PlayerName: user.username,
            PlayerPass: user.password,
            Function: 'UpdatePlayerPassword'
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execplayTechApi(parameter);
    },

    // Signin to Playtech, API return a link to assign to iframe
    signin: function(username, password, gameCode) {
        var parameter = {
            username: username + '@HOKI',
            password: password,
            gamecode: gameCode,
            langcode: 'en',
        }
        console.log(parameter);
        apiPlayTech.url = 'http://login.pt.gsoft88.net/createurl.aspx';

        return execplayTechApi(parameter);
    },

    // Signout to playTech
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
        }
        return execplayTechApi(parameter);
    },

    // Get credit user from playTech
    getBalance: function(username) {

        var parameter = {
            PlayerName: username,
            Function: 'CheckBalance'
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';
        return execplayTechApi(parameter);
    },

    // Deposit to playTech
    deposit: function(ticket) {

        var parameter = {
            PlayerName: ticket.username,
            Function: 'Deposit',
            Amount: ticket.amount * 1000,
            TransacID: datetimeService.getmmdd() + 'DP' + ticket.id
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execplayTechApi(parameter);
    },

    // Withdrawn to playTech
    withdrawn: function(ticket) {

        var parameter = {
            PlayerName: ticket.username,
            Function: 'Withdraw',
            Amount: ticket.amount * 1000,
            TransacID: datetimeService.getmmdd() + 'WD' + ticket.id
        }
        apiPlayTech.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execplayTechApi(parameter);
    },

    // Return title of game
    getTitle: function() {
        return apiPlayTech.title;
    },

    // Get turnover
    getTurnOver: function(username) {
        return new promise(function(resolve, reject) {

            var curl = new Curl(),
                url = 'http://128.199.77.130:1337/api/betting/playtech/turnover',
                data = {
                    username: username
                };

            data = queryString.stringify(data);

            curl.setOpt(Curl.option.URL, url);
            curl.setOpt(Curl.option.POSTFIELDS, data);
            curl.setOpt(Curl.option.HTTPHEADER, ['User-Agent: node-libcurl/1.0']);
            curl.setOpt(Curl.option.VERBOSE, true);

            curl.perform();

            curl.on('end', function(statusCode, body) {
                console.log(body);
                var result = JSON.parse(body);
                return resolve({
                    result: true,
                    title: apiPlayTech.title,
                    data: result.turnover
                });

                this.close();
            });

            curl.on('error', curl.close.bind(curl));
        })
    },

    getPassword: function(username) {
        return new promise(function(resolve, reject) {
            CredentialPlaytech.findOne({ username: username })
                .then(function(playtech) {
                    if (playtech) {
                        return resolve(playtech.password);
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

var execplayTechApi = function(parameter) {
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
        return (result.CheckBalance.BALANCE / 1000);
    },
    deposit: function(result) {
        return result.Deposit.amount;
    },
    withdraw: function(result) {
        return result.Withdraw.amount;
    }
}
