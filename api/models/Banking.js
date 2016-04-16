/**
 * Banking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        autoCreatedAt: false,
        autoUpdatedAt: false,
        bank_name: {
        	type: 'string'
        },
        order: {
        	type: 'string'
        },
        account_name: {
        	type: 'string'
        },
        account_number: {
        	type: 'string'
        }
    }
};
