'use strict';

const searchController = require('./controller/search.controller.js');
const searchMiddleware = require('./middleware/search.middleware.js');

const internals = {
};

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/add-search',
        handler: searchController.addSearch,
        config: {
            pre: [
                { method: searchMiddleware.findSearch, assign: 'findSearch' },
            ],
        },

    });

    server.route({
        method: 'GET',
        path: '/search',
        handler: searchController.search,
    });

    next();
};

exports.register.attributes = {
    name: 'api-search'
};
