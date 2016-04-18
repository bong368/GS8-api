/**
 * Withdrawn.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	tableName: 'withdraws',

    attributes: {
        created_at: {
            type: 'datetime'
        },
        updated_at: {
            type: 'datetime'
        },
        payment_method: {
            type: 'string'
        },
        bank_name: {
            type: 'string'
        },
        bank_account_name: {
            type: 'string'
        },
        bank_account_number: {
            type: 'string'
        },
        currency: {
            type: 'string'
        },
        amount: {
            type: 'string'
        },
        username: {
            type: 'string'
        },
        status: {
        	type: 'string'
        }
    }
};
