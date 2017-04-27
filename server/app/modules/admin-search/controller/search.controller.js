'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const Search = mongoose.model('Search');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

const async = require("async");
const _ = require('lodash');
const fs = require('fs');
const util = require('util');

module.exports = {
    getAll,
    create,
    edit,
    update,
    del,
    active
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    let promise = Search.find().paginate(page, itemsPerPage, function (err, items, total) {
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataSend = {
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items,
        };
        reply(dataSend);
    });
}

function create(request, reply) {
    if (request.pre.getByKeyword) {
        return reply(Boom.badRequest('Từ khóa đã tồn tại.'));
    }
    let searchNew = new Search(request.payload.data);

    let promise = searchNew.save();
    promise.then(function (res) {
        // Create auditLog
        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'create',
            'search',
            JSON.stringify({ new: searchNew }),
            'Thêm từ khóa tìm kiếm'
        );
        return reply({ success: true });
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function edit(request, reply) {
    return reply({ data: request.pre.getById });
}

function update(request, reply) {
    let searchOld = request.pre.getById;
    let searchNew = request.payload.data;
    let user = request.pre.getAuthUser;
    if (searchOld.keyword != searchNew.keyword) {
        if (request.pre.getByKeyword) {
            return reply(Boom.badRequest('Từ khóa đã tồn tại.'));
        }
    }

    // Create auditLog
    request.auditLog.logEvent(
        user._id.toString(),
        'mongoose',
        'update',
        'search',
        JSON.stringify({ new: searchNew, old: searchOld }),
        'Chỉnh sửa từ khóa tìm kiếm'
    );

    let searchUpdate = _.extend(searchOld, searchNew);
    let promise = searchUpdate.save();

    promise.then(function (resp) {
        return reply({ success: true });
    });
}

function del(request, reply) {
    let promise = Search.findByIdAndRemove(request.params.id);
    let user = request.pre.getAuthUser;
    let search = request.pre.getById;

    promise.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'update',
            'search',
            JSON.stringify({ old: search }),
            'Chỉnh sửa từ khóa tìm kiếm'
        );

        return reply({ success: true });
    });
}

function active(request, reply) {
    let search = request.pre.getById;
    search.status = !search.status;
    let promise = search.save();
    let user = request.pre.getAuthUser;

    promise.then(function (resp) {
        // Create auditLog
        search.status = !search.status;
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'update',
            'search',
            JSON.stringify({ new: resp, old: search }),
            'Active/unactive từ khóa tìm kiếm'
        );

        reply({ success: true });
    })
}