/**
 * UserBonus.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'user_bonus',

    attributes: {
        bonus_id: {
            type: 'integer'
        },
        turnover: {
        	type: 'float'
        },
        bonus_amount: {
        	type: 'float'
        },
        rolling_amount: {
        	type: 'float'
        }
    }
};
