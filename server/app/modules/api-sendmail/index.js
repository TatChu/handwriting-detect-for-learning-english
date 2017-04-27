'use strict';

const SendmailController = require('./controller/sendmail.controller.js');
const SendmailValidate = require('./validate/sendmail.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

const internals = {
};

exports.register = function (server, options, next) {
    var config = server.plugins['hapi-kea-config'];
    let pubsub = server.plugins['app-pubsub'].pubsub;
    let emailHelper = require('./util/mail')(server, options);
    var configManager = server.configManager;
    
    server.expose('sendMail', emailHelper.sendMail);

    server.route({
        method: 'GET',
        path: '/sendmail',
        handler: SendmailController.index,
        config: {
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'POST',
        path: '/sendmail',
        handler: SendmailController.sendmail,
        config: {
            validate : SendmailValidate.sendmail,
            // description: 'Send email',
            // tags: ['api'],
            // plugins: {
            //     'hapi-swagger': {
            //         responses: { '400': { 'description': 'Bad Request' } },
            //     }
            // }
        }
        
    });
    
    pubsub.subscribe('api-sendmail', function () {
        console.log('receive message');
        // console.log(arguments);
        let emailData = arguments[1];
        emailHelper.sendMail(emailData);

    });

    next();
};

exports.register.attributes = {
    name: 'api-sendmail'
};
