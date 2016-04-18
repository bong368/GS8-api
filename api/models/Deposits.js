/**
 * Deposit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
    	created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string'
        },
        payment_method: {
        	type: 'string'
        },
        from_bank: {
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
        to_bank: {
        	type: 'string'
        },
        amount: {
        	type: 'string'
        },
        username: {
        	type: 'string'
        },
        extra_bonus: {
        	type: 'string'
        },
        status: {
            type: 'string'
        }
    }
};
