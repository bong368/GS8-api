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
apiCookfight = {
    title: 'Cookfight',
    url: 'http://api2288.30k30k.info/',
    agent: 'FC5FEC36C0DE4555BAF1440A7E139876',
    secret: 'IC060101',
    signinHost: 'login.pt.gsoft88.net'
}

module.exports = {

    // Create new account playTech
    signup: function(ticket) {

        var parameter = {
            login_id: ticket.username,
            name: ticket.username,
            function: 'deposit.aspx',
            amount: ticket.amount,
            ref_no: datetimeService.getmmdd() + 'NEW',
            odds_type: 'ID'
        }

        return execplayCookfightApi(parameter);
    },

    // Create new account playTech
    updatePassword: function(user) {

        var parameter = {
            PlayerName: user.username,
            PlayerPass: user.password,
            function: 'UpdatePlayerPassword'
        }
        apiCookfight.url = 'http://api.pt.gsoft88.net/VMSWservices.aspx';

        return execplayCookfightApi(parameter);
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
        apiCookfight.url = 'http://login.pt.gsoft88.net/createurl.aspx';

        return execplayCookfightApi(parameter);
    },

    // Signout to playTech
    signout: function(username) {

        var parameter = {
            username: username,
            action: 'logout'
        }
        return execplayCookfightApi(parameter);
    },

    // Get credit user from playTech
    getBalance: function(username) {

        var parameter = {
            login_id: ticket.username,
            function: 'get_balance.aspx'
        }

        return execplayCookfightApi(parameter);
    },

    // Deposit to playTech
    deposit: function(ticket) {

        var parameter = {
            login_id: ticket.username,
            name: ticket.username,
            function: 'deposit.aspx',
            amount: ticket.amount,
            ref_no: datetimeService.getmmdd() + 'DP' + ticket.id,
            odds_type: 'ID'
        }

        return execplayCookfightApi(parameter);
    },

    // Withdrawn to playTech
    withdrawn: function(ticket) {

        var parameter = {
            login_id: ticket.username,
            function: 'withdraw.aspx ',
            amount: ticket.amount,
            ref_no: datetimeService.getmmdd() + 'DP' + ticket.id
        }

        return execplayCookfightApi(parameter);
    },

    // Return title of game
    getTitle: function() {
        return apiCookfight.title;
    },

    // Get turnover
    getTurnOver: function(username, agent, dateFrom) {
        console.log(dateFrom);
        return new promise(function(resolve, reject) {

            var curl = new Curl(),
                url = sails.API_URL.BETTING + 'api/betting/playtech/turnover',
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

                console.log("\n *** Get Playtech turnover: ".green + sails.moment(new Date()).format('YYYY-MM-DD HH:mm:ss').green);
                console.log(body);

                var result = JSON.parse(body);
                return resolve({
                    result: true,
                    title: apiCookfight.title,
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

var execplayCookfightApi = function(parameter) {
    return new promise(function(resolve, reject) {

        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });
        credential = {
            agent_code: apiCookfight.secret,
            api_key: apiCookfight.agent,
        }
        url = apiCookfight.url + parameter.function;
        if (parameter.function) {
            parameter = _.merge(parameter, credential);
        }

        query = '?' + queryString.stringify(parameter);

        curl.setOpt('URL', url + query);

        curl.on('end', function(statusCode, body, headers) {
            var xml = body.replace(/&/g, "&amp;");
            parser.parseString(xml, function(err, result) {
                console.log(result);
                return resolve(adapterCurlResult(result, parameter.function));
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
        case 'get_balance.aspx':
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
        if (result.get_balance.status_code == "00")
            return {
                result: true,
                title: apiCookfight.title,
                data: result.get_balance.balance
            }
        else
            return {
                result: false,
                title: apiCookfight.title,
                error: result.get_balance.status_code
            }
    },
    deposit: function(result) {
        return result.Deposit.amount;
    },
    withdraw: function(result) {
        return result.Withdraw.amount;
    }
}
