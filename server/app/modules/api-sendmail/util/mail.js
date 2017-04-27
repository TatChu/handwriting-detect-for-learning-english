'use strict'

const mongoose = require('mongoose');
const _ = require('lodash');
const Email = mongoose.model('Email');
const nodemailer = require('nodemailer');

let saveMail = function(emailData){
    let email = new Email(emailData);
    let promise = email.save();
    return promise;
};

let mailer =  function(server, emailData, callback){
    let config = server.configManager;
    // Create a SMTP transporter object
    let options = config.get('web.mailer.options');
    let defaults = config.get('web.mailer.defaults');
    var transporter = nodemailer.createTransport(options, defaults);

    let message = emailData;
    if(message.template && message.template.name){
        let context = _.merge(emailData, message.template.context ? message.template.context : {} );
        server.render(`api-sendmail/view/${emailData.template.name}`, context, {layout: 'email/layout'}, function(err, html){
            //_.unset(message, 'template');
            message.html = html;
            transporter.sendMail(message, callback);
        });
    }else{
        transporter.sendMail(message, callback);
    }
};

module.exports = function(server, options){
    return {
        sendMail: function(emailData, callback){
            let promise = saveMail(emailData);
            promise.then(function (emailInfo) {
                //send email
                mailer(server, emailData, function (error, info) {
                    if (error) {
                        server.log(['mail', 'error'], 'Error occurred');
                        server.log(['mail', 'error'], error.message);

                    }
                    server.log(['info'], 'Message sent successfully!');
                    server.log(['info'], 'Server responded with "%s"', info.response);
                    if(typeof callback === 'function') {
                        callback(error, info);
                    }
                });

            }).catch(function (err) {
                server.log(['mail', 'error'], err);
                if(typeof callback === 'function') {
                    callback(err);
                }
            });
        }

    };
}
