/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing WFT API
 */
var promise = require('bluebird');

module.exports = {

    // Create new account WFT
    syncAccount: function(user) {
        var games = this.initializationGames();
        var asyncTasks = [];
        // Loop through some Game Sites
        games.forEach(function(game) {
            // Push closure to tasks
            asyncTasks.push(function(callback) {

                game.signup(user)
                    .then(function(response) {
                        callback(null, response);
                    })
                    .catch(function(error) {
                        callback(null, error);
                    })
            });
        });

        return new promise(function(resolve, reject) {
            async.parallel(asyncTasks, function(err, results) {
                if (err)
                    return resolve({
                        result: true,
                        data: err
                    });
                else
                    return resolve({
                        result: true,
                        data: results
                    });
            });

        })
    },

    // Get title all game
    getTitle: function() {
        var games = this.initializationGames();
        var result = [];
        // Loop through some Game Sites
        games.forEach(function(game) {
            result.push(game.getTitle());
        })
        return result;
    },

    // Get balance
    getBalance: function(username) {
        var games = this.initializationGames();
        games.unshift(mainWalletService);
        var asyncTasks = [];
        // Loop through some Game Sites
        games.forEach(function(game) {
            // Push closure to tasks
            asyncTasks.push(function(callback) {

                game.getBalance(username)
                    .then(function(response) {
                        callback(null, response);
                    })
                    .catch(function(error) {
                        callback(null, error);
                    })
            });
        });

        return new promise(function(resolve, reject) {
            async.parallel(asyncTasks, function(err, results) {
                if (err)
                    return resolve({
                        result: true,
                        data: err
                    });
                else
                    return resolve({
                        result: true,
                        data: results
                    });
            });

        })
    },

    getServiceFromName: function(title) {
        var services = this.initializationGames();
        apiService = undefined;

        services.push(mainWalletService);
        _.forEach(services, function(service, key) {
            if (service.getTitle() == title) {
                apiService = service;
                return false
            }
        });
        return apiService;
    },

    getTurnOver: function (username) {
        var games = this.initializationGames();
        var asyncTasks = [];
        // Loop through some Game Sites
        games.forEach(function(game) {
            // Push closure to tasks
            asyncTasks.push(function(callback) {

                game.getTurnOver(username)
                    .then(function(response) {
                        callback(null, response);
                    })
                    .catch(function(error) {
                        callback(null, error);
                    })
            });
        });

        return new promise(function(resolve, reject) {
            async.parallel(asyncTasks, function(err, results) {
                if (err)
                    return resolve({
                        result: true,
                        data: err
                    });
                else {
                    var turnOver = 0;
                    _.forEach(results, function(value, key) {
                        turnOver += value.data;
                    });
                    return resolve({
                        result: true,
                        data: turnOver
                    });
                }
            });

        })
    },

    // Get all game
    initializationGames: function() {
        return [wftService];
    }
};
