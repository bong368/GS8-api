var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

module.exports = {

    parse: function(req, rawToken, callback) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if (!rawToken)
                var token = self.getRaw(req);
            else
                var token = req;

            payload = jwt.decode(token, 'json');
            cred = false;

            if (payload) {
                Users.findOne({
                        id: payload.sid
                    })
                    .then(function(user) {
                        cred = user;
                        return Banking.findOne({
                            id: user.bank_id
                        })
                    })
                    .then(function(banking) {
                        cred.bank_name = banking.bank_name;
                        return resolve(cred);
                    })
                    .catch(function(err) {
                        return reject(new Error({error: 'invalid_token'}));
                    })
            } else {
                return reject(new Error({error: 'invalid_token'}));
            }
        })
    },

    getRaw: function(req) {
        var token;
        
        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0],
                    credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            } else {
                return false;
            }
        } else if (req.param('token')) {
            token = req.param('token');
            // We delete the token from param to not mess with blueprints
            delete req.query.token;
        } else {
            return false;
        }
        return token;
    },

    //  Here we Generate token 
    generate: function(payload) {
        return jwt.sign(
            payload, // This is the payload we want to put inside the token
            process.env.TOKEN_SECRET || "1234567890~!@#$%^&*(){}qwertyQWERTY" // Secret string which will be used to sign the token
        );
    },

    // Here we verify that the token we received on a request hasn't be tampered with.
    verify : function(token, verified) {
        return jwt.verify(
            token, // The token to be verified
            process.env.TOKEN_SECRET || "1234567890~!@#$%^&*(){}qwertyQWERTY", // The secret we used to sign it.
            {}, // Options, none in this case
            verified // The callback to be call when the verification is done.
        );
    }
};
