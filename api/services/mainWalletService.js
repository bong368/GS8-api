/**
 * Sportsbook WFT Service
 *
 * @description :: Server-side logic for managing main wallet
 */
var promise = require('bluebird');
mainWallet = {
    title: 'Main Wallet',
}

module.exports = {

    // Deposit to main Wallet
    deposit: function(ticket) {
        return new promise(function(resolve, reject) {
            Users.findOne({ username: ticket.username })
                .then(function(cred) {
                    return Users.update({
                        username: ticket.username
                    }, {
                        main_balance: parseFloat(cred.main_balance) + parseFloat(ticket.amount)
                    })
                })
                .then(function(deposit) {
                    return resolve({
                        result: true,
                        data: deposit
                    })
                })

        })
    },

    // Signin to WFT, API return a link to assign to iframe
    withdrawn: function(ticket) {
        return new promise(function(resolve, reject) {
            Users.findOne({ username: ticket.username })
                .then(function(cred) {
                    return Users.update({
                        username: ticket.username
                    }, {
                        main_balance: parseFloat(cred.main_balance) - parseFloat(ticket.amount)
                    })
                })
                .then(function(withdrawn) {
                    return resolve({
                        result: true,
                        data: withdrawn
                    })
                })

        })

    },

    // Return title of game
    getTitle: function() {
        return mainWallet.title;
    },

    // Get credit user from main wallet
    getBalance: function(username) {

        return new promise(function(resolve, reject) {
            Users.findOne({ username: username })
                .then(function(cred) {
                    console.log(red);
                    return resolve({
                        result: true,
                        title: mainWallet.title,
                        data: cred.main_balance
                    })
                })

        })
    },
};
