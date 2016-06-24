/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    '*': ['tokenAuth'], // Everything resctricted here
    'ViewController': {
        'playGame': true,
    },

    'UsersController': {
        'create': true, // We dont need authorization here, allowing public access
        'updatePassword' : true
    },

    'AuthController': {
        '*': true, // We dont need authorization here, allowing public access
        'changePassword': ['changePasswordPolicy']
    },
    'BankingController': {
        '*': true
    },

    'DepositsController': {
    	'create': ['requiredPassword', 'limitDeposit', 'pendingDeposit', 'extraBonus', 'isIntAmount']
    },

    'WithdrawnsController': {
    	'create': ['requiredPassword', 'limitWithdrawn', 'overAmount', 'isIntAmount']
    },

    'TransfersController': {
        'create': ['isIntAmount', 'overApiAmount', 'meetTurnOverTransfer']
    },

    'PlaytechController': {
        'signin': true,
        'getAllGame': true,
        'updatePassword': ['duplicatePassword']
    },

    'GamePlayController': {
        'getAllGame': true,
        'authencation': true
    },

    'TestController': {
        '*': true
    },

    'WftController': {
        'signin': true
    },

    'AllBetController': {
        'signin': true
    },
    
    'EmailController': {
        '*': true
    }
};
