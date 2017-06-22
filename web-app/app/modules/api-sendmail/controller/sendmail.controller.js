'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    index,
    sendmail,
};

function index (request, reply) {
    return reply({ status: true, msg: 'It works'});
}

function sendmail (request, reply) {
    let emailData = request.payload;
    
    let emailHelper = require('../util/mail')(request.server);
    emailHelper.sendMail(emailData, function (error, info) {
        if (error) {
            reply(Boom.badRequest(error));
        }
        reply({ status: true, msg: 'Send email success' });
    });
}

