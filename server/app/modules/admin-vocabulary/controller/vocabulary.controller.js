'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Vocabulary = mongoose.model('Vocabulary');
const Unit = mongoose.model('Unit');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    edit,
    save,
    update,
    deleteItem,

    getUnitsByClasses
}

function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.word = message;
    }
    Vocabulary.find(options).sort('-createdAt').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: true, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });
}

function edit(request, reply) {
    const vocabulary = request.pre.vocabulary;
    if (vocabulary) {
        return reply(vocabulary);
    } else {
        reply(Boom.notFound('Vocabulary is not found'));
    }
}

function save(request, reply) {
    let vocabulary = new Vocabulary(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'vocabulary',
        JSON.stringify({ new: vocabulary, old: null }),
        'add new vocabulary'
    );
    let promise = vocabulary.save();
    promise.then(function (vocabulary) {
        reply(vocabulary);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let vocabulary = request.pre.vocabulary;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'vocabulary',
        JSON.stringify({ new: _.extend(vocabulary, request.payload), old: vocabulary }),
        'update vocabulary'
    );
    vocabulary = _.extend(vocabulary, request.payload);
    let promise = vocabulary.save();
    promise.then(function (vocabulary) {
        reply(vocabulary);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function deleteItem(request, reply) {
    const vocabulary = request.pre.vocabulary;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'vocabulary',
        JSON.stringify({ new: null, old: vocabulary }),
        'delete vocabulary'
    );
    vocabulary.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(vocabulary);
    });
}

function getUnitsByClasses(request, reply) {
    let classes = request.params.classes;
    Unit.find({ classes: classes }).sort('index_unit').exec(function (err, items) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply({ success: true, data: items })
    });
}