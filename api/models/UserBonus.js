/**
 * UserBonus.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'user_bonus',

    attributes: {
        created_at: {
            type: 'datetime'
        },
        updated_at: {
            type: 'datetime'
        },
        bonus_id: {
            model : "bonus"
        },
        turnover: {
        	type: 'float'
        },
        bonus_amount: {
        	type: 'float'
        },
        rolling_amount: {
        	type: 'float'
        },
        username: {
            type: 'string'
        },
        transaction_id: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        process_by: {
            type: 'string'
        }
    }
};
