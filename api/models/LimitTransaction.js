/**
 * LimitTransaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	tableName: 'transaction_limit',

    attributes: {
    	deposit_max: {
        	type: 'float'
        },
        deposit_min: {
        	type: 'float'
        },
        withdraw_min: {
        	type: 'float'
        },
        withdraw_max: {
        	type: 'float'
        },
        transfer_min: {
        	type: 'float'
        },
        transfer_max: {
        	type: 'float'
        },
        currency: {
        	type: 'string'
        }
    }
};
