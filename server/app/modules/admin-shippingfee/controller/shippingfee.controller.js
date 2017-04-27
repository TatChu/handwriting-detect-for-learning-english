'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ShippingFee = mongoose.model('ShippingFee');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    edit,
    save,
    update,
    del,
    getAllNoPaging,
    getShipingFeeConfig
};

function getAll (request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.type) {
        options.type = request.query.type;
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'i');
        options.$or = [
            {
                district: re
            }
        ]
    }
    ShippingFee.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'shippingfee'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });

}


function getShipingFeeConfig(request, reply){
    let listShippingFee = require('./../../../utils/commander/data/shippingfee.json');
    return reply(({items: listShippingFee.shippingfee}));
}

function edit (request, reply) {
    const shippingfee = request.pre.shippingfee;
    if (shippingfee) {
        return reply(shippingfee)
    } else {
        reply(Boom.notFound('ShippingFee is not found'));
    }
}



function save (request, reply) {
    let shippingfee = new ShippingFee(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'shippingfee',
        JSON.stringify({ new: shippingfee, old: null }),
        'add new shippingfee'
    );

    let promise = shippingfee.save();
    promise.then(function (shippingfee) {
        reply(shippingfee);
    }).catch(function (err) {
        request.log(['error', 'shippingfee'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update (request, reply) {
    let shippingfee = request.pre.shippingfee;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'shippingfee',
        JSON.stringify({ new: _.extend(shippingfee, request.payload), old: shippingfee }),
        'update shippingfee'
    );
    shippingfee = _.extend(shippingfee, request.payload);
    ;
    let promise = shippingfee.save();
    promise.then(function (shippingfee) {
        reply(shippingfee);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function del (request, reply) {
    const shippingfee = request.pre.shippingfee;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'shippingfee',
        JSON.stringify({ new: null, old: shippingfee }),
        'delete shippingfee'
    );

    shippingfee.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(shippingfee);
    });
}


function getAllNoPaging (request, reply) {
    ShippingFee.find({}).exec(function (err, items) {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let dataRes = { success: true, items: items };
        reply(dataRes);
    });
}


// End : Handler list method



