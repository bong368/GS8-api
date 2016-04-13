/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

// We don't want to store password with out encryption
var bcrypt = require('bcryptjs');

module.exports = {

    schema: true,

    /**
     * Validate user credentials 
     */
    attributes: {
        
        createdAt: {
            type: 'datetime', columnName: 'created_at'
        },
        updatedAt: {
            type: 'datetime', columnName: 'updated_at'
        },
        username: {
            type: 'string', required: 'true', unique: true, minLength: 3, maxLength: 30
        },
        email: {
            type: 'email', required: 'true', unique: true, maxLength: 30
        },
        password: {
            type: 'string', required: 'true', regex: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', minLength: 6, maxLength: 30
        },
        phone: {
            type: 'string', required: 'true', regex: '/^[0-9\-\+]{10,20}$/'
        },
        currency: {
            type: 'string', required: 'true', minLength: 3, maxLength: 3
        },
        bank_id: {
            type: 'number', required: 'true', minLength: 1, maxLength: 5
        },
        bank_account_number: {
            type: 'string', required: 'true', minLength: 10, maxLength: 15
        },
        bank_account_name: {
            type: 'string', required: 'true', minLength: 3, maxLength: 30
        },


        // We don't wan't to send back encrypted password either
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    /**
     * Model validation messages definitions
     */
    validationMessages: {
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        username: {
            required: 'Username is required'
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

    /**
     * Check if match password
     */
    comparePassword: function(password, user, cb) {
        bcrypt.compare(password, user.encryptedPassword, function(err, match) {
            if (err) cb(err);
            if (match) {
                cb(null, true);
            } else {
                cb(err);
            }
        })
    }
};
