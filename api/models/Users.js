/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

// We don't want to store password with out encryption
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
module.exports = {
 
    schema: true,

    /**
     * Validate user credentials 
     */
    attributes: {

        created_at: {
            type: 'datetime'
        },
        updated_at: {
            type: 'datetime'
        },
        username: {
            type: 'string',
            required: true,
            unique: true,
            alphanumericdashed: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true,
            password: true
        },
        phone: {
            type: 'string',
            required: true,
            phone: true
        },
        currency: {
            type: 'string',
            required: true,
            minLength: 2,
            maxLength: 3
        },
        bank_id: {
            type: 'string',
            required: true,
            minLength: 1,
            maxLength: 5
        },
        bank_account_number: {
            type: 'string',
            required: true,
            minLength: 10,
            maxLength: 15
        },
        bank_account_name: {
            type: 'string',
            required: true,
            minLength: 3,
            maxLength: 30
        },
        main_balance: {
            type: 'float',
        },
        bonus_info: {
            type: 'string',
        },


        // We don't wan't to send back encrypted password either
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    types: {
        phone: function (value) {
            return _.isString(value) && value.length >= 6 && value.length < 15 && value.match(/[+]/)  && value.match(/[0-9]/);
        },
        password: function(value) {
            return _.isString(value) && value.length >= 6 && value.match(/[a-z]/i) && value.match(/[0-9]/);
        }
    },
    /**
     * Model validation messages definitions
     */
    validationMessages: {
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken',
            regex: 'Email does not match format'
        },
        username: {
            alphanumericdashed: 'Username is a string consisting of only letters, numbers, and/or dashes.',
            unique: 'Username is already taken',
            required: 'Username is required',
        },
        password: {
            required: 'Password is required',
            password: 'Password does not match format'
        },
        phone: {
            required: 'Phone is required',
            phone: 'Phone does not match format'
        },
        bank_account_number: {
            required: 'Bank account number id is required',
            minLength: 'Bank account number must be at least 10 characters.',
            maxLength: 'Bank account number may not be greater than 15 characters.'
        },
        bank_account_name: {
            required: 'Bank account name id is required',
            minLength: 'Bank account number must be at least 3 characters.',
            maxLength: 'Bank account number may not be greater than 30 characters.'
        }
    },

    /**
     * Here we encrypt password before creating a User
     */
    beforeCreate: function(values, next) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(values.password, salt, function(err, hash) {
                if (err) return next(err);
                values.password = hash;
                next();
            })
        })
    },

    hashPassword: function (password) {
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) return false;
                    return resolve(hash);
                })
            })
        })
    },

    /**
     * Check if match password
     */
    comparePassword: function(password, user, callback) {
        bcrypt.compare(password, user.password, function(err, match) {

            if (err) callback(err);
            if (match) {
                callback(null, true);
            } else {
                callback(err);
            }
        })
    },

    /**
     * Validated password format
     */
    validatePassword: function(value) {
        return _.isString(value) && value.length >= 6 && value.match(/[a-z]/i) && value.match(/[0-9]/);
    }
};
