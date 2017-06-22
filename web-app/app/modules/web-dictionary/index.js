'use strict';

const DictionaryController = require('./controller/dictionary.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/tra-tu-dien',
        handler: DictionaryController.dictionary,
        config: {
        },
    });

    server.route({
        method: 'GET',
        path: '/tra-tu-dien/{lang}/{word}',
        handler: DictionaryController.searchDictionary,
        config: {
        },
    });
    next();
};

exports.register.attributes = {
    name: 'web-dictionary'
};
