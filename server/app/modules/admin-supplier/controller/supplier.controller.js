'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Supplier = mongoose.model('Supplier');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    edit,
    save,
    update,
    deleteItem
}

function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};
    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.$or = [{
            name: message
        }, {
            email: message
        },
        {
            phone: message
        }
        ]
    }
    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;
    Supplier.find(options).paginate(page, 10, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });
}


function edit(request, reply) {
    const supplier = request.pre.supplier;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'edit',
        'supplier',
        JSON.stringify({ new: null, old: supplier }),
        'get a supplier'
    );
    if (supplier) {
        return reply(supplier);
    } else {
        reply(Boom.notFound('Supplier is not found'));
    }
}


function save(request, reply) {
    let supplier = new Supplier(request.payload);
      request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'supplier',
        JSON.stringify({ new: supplier, old: null }),
        'add new supplier'
    );
    let promise = supplier.save();
    promise.then(function (supplier) {
        reply(supplier);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let supplier = request.pre.supplier;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'supplier',
        JSON.stringify({ new: _.extend(supplier, request.payload), old: supplier }),
        'update supplier'
    );

    supplier = _.extend(supplier, request.payload);
    let promise = supplier.save();
    promise.then(function (supplier) {
        reply(supplier);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}


function deleteItem(request, reply) {
    const supplier = request.pre.supplier;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'supplier',
        JSON.stringify({ new: null, old: supplier }),
        'delete supplier'
    );

    supplier.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(supplier);
    });
}
