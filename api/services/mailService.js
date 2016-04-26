/**
 * Mail Service
 *
 * @description :: Server-side logic for managing Mail
 */
var nodemailer = require('nodemailer');
    promise = require('bluebird');

module.exports = {

    sendWelcomeEmail: function(user) {

        // create reusable transporter object using the default SMTP transport
        var query = 'smtps://' + sails.config.mail.username + ':' + sails.config.mail.password + '@smtp.gmail.com'
        var transporter = nodemailer.createTransport(query);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Hokibet188.com 👥" <hokibet188@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Welcome to Hokibet188 ✔', // Subject line
            text: 'Asia Best Online Betting And Gaming Site', // plaintext body
            html: createWelcomeMailTemplate(user.username)
        };
        return new promise(function(resolve, reject) {
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return reject({
                        result: false,
                        error: error
                    });
                } else {
                    return resolve({
                        result: true,
                        data: info.response
                    });
                }
            });
        })
    },
};

var createWelcomeMailTemplate = function(fullname) {
    var html = "<h3 style='text-align: center;background-color: #d24a1f;color: #fff;font-size: 25px;padding: 5px;border-radius: 2px;'>Hi, " + fullname + "</h3>";
    html += "<p>Welcome To HOKIBET188, enjoy the best gaming experience and the most secure through our partnership with a number of well-known brand holders and the industry's largest online casino games.</p>";
    html += "<a style='font-size: 16px;color: #ffffff;text-decoration: none;background-color: #3572b0;border-top: 11px solid #3572b0;border-bottom: 11px solid #3572b0;border-left: 20px solid #3572b0;border-right: 20px solid #3572b0;border-radius: 2px;' href='hokibet188.com'>Enjoy Now</a>";
    html += "<p>Cheers,</p><p>Hokibet</p>";
    return html;
}
