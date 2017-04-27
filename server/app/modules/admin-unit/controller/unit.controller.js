'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Unit = mongoose.model('Unit');
const _ = require('lodash');

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
        options.message = message;
    }
    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;
    Unit.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
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
    const unit = request.pre.unit;
    if (unit) {
        return reply(unit);
    } else {
        reply(Boom.notFound('Unit is not found'));
    }
}

function save(request, reply) {
    let unit = new Unit(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'unit',
        JSON.stringify({ new: unit, old: null }),
        'add new unit'
    );
    let promise = unit.save();
    promise.then(function (unit) {
        reply(unit);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let unit = request.pre.unit;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'unit',
        JSON.stringify({ new: _.extend(unit, request.payload), old: unit }),
        'update unit'
    );
    unit = _.extend(unit, request.payload);
    let promise = unit.save();
    promise.then(function (unit) {
        reply(unit);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function deleteItem(request, reply) {
    const unit = request.pre.unit;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'unit',
        JSON.stringify({ new: null, old: unit }),
        'delete unit'
    );
    unit.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(unit);
    });
}