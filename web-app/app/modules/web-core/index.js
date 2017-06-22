'use strict';

const CoreController = require('./controller/core.controller.js');

exports.register = function (server, options, next) {
    server.ext('onPostHandler', CoreController.createGuestToken);
    server.ext('onPostHandler', CoreController.getCredentials);
    server.ext('onPostHandler', CoreController.getMeta);
    server.ext('onPreResponse', CoreController.handleError);
    server.ext('onPreResponse', function (request, reply) {

        if (request.response.variety === 'view') {
            request.response.source.context = request.response.source.context || {};
            request.response.source.context.isDevelopment = (process.env.NODE_ENV === 'development');
        }

        reply.continue();
    });

    /*  ROUTER  */
    server.route({
        method: 'GET',
        path: '/error404',
        config: {},
        handler: function (request, reply) {
            reply.view('web-core/view/404', {
                meta: {
                    title: 'Page Not Found'
                },
                error404: true
            }, { layout: 'web/layout-error' });
        }
    });

    server.route({
        method: 'GET',
        path: '/error403',
        config: {},
        handler: function (request, reply) {
            reply.view('web-core/view/403', {
                meta: {
                    title: 'Not Permission'
                }
            }, { layout: 'web/layout-error' });
        }
    });

    next();
};
exports.register.attributes = {
    name: 'web-core'
};
