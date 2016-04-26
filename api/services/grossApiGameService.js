/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing WFT API
 */
var promise = require('bluebird');

module.exports = {

    // Create new account WFT
    syncAccount: function(user) {
        var gameSites = [wftService];
        var asyncTasks = [];
        // Loop through some Game Sites
        gameSites.forEach(function(game) {
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


};
