'use strict';

const DictionaryController = require('./controller/dictionary.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/tra-tu-dien/{word?}',
        handler: DictionaryController.dictionary,
        config: {
        },
    });
    next();
};

exports.register.attributes = {
    name: 'web-dictionary'
};
