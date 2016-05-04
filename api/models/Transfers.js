/**
 * Transfers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        username: {
            type: 'string'
        },
        amount: {
            type: 'float'
        },
        currency: {
            type: 'string'
        },
        origin: {
            type: 'string'
        },
        target: {
            type: 'string'
        },
        origin_result: {
            type: 'string'
        },
        target_result: {
            type: 'string'
        }
    }
};
