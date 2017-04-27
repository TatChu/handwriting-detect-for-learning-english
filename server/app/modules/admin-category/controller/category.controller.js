'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const slug = require('slug');

module.exports = {
    getAll,
    edit,
    getOneById,
    save,
    getAllChild,
    deleteItem,
    update
};
function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};

    // get All or get Category level 1
    if (request.query.parrent_id != "*") {
        options.parrent_id = null;
    }

    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            {
                name: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(slug_keyword, 'i')
            }
        ];
        // fix search all category
        delete options['parrent_id'];
    }

    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;

    Category.find(options).paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);

    });
}
function edit(request, reply) {
    let categories = request.pre.categories;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'edit', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: null, old: categories }),   //data new, old
        'get a categories'    //change log description
    );

    if (categories) {
        reply(categories);
    } else {
        //fix
        reply({
            status: false,
            message: 'Category is not found!'
        });
    }
}

function getOneById(request, reply) {
    const categories = request.pre.categories;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'edit', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: null, old: categories }),   //data new, old
        'get a categories'    //change log description
    );
    if (categories) {
        return reply(categories);
    } else {
        reply(Boom.notFound('Category is not found'));
    }
}

function save(request, reply) {
    let categories = new Category(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'save', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: categories, old: null }),   //data new, old
        'add new categories'    //change log description
    );

    let promise = categories.save();
    promise.then(function (categories) {
        reply(categories);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let categories = request.pre.categories;
    categories = _.extend(categories, request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'update', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: _.extend(categories, request.payload), old: categories }),   //data new, old
        'update category'    //change log description
    );

    let promise = categories.save();
    promise.then(function (categories) {
        reply(categories);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function deleteItem(request, reply) {
    const categories = request.pre.categories;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',         //origin ex: mongoose or route
        'delete', //action : function name
        'category',            // label: module name
        JSON.stringify({ new: null, old: categories }),   //data new, old
        'delete category'    //change log description
    );

    categories.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(categories);
    });
}

function getAllChild(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};
    let parrentId = request.params.parrentId;
    options.parrent_id = parrentId;

    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            {
                name: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(slug_keyword, 'i')
            }
        ];
        // fix search all category
        delete options['parrent_id'];
    }

    Category.find(options).paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);

    });
}