'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Certificate = mongoose.model('Certificate');
const Product = mongoose.model('Product');
const _ = require('lodash');
const productHelper = require(BASE_PATH + '/app/modules/admin-product/util/product');

module.exports = {
    getAll,
    edit,
    save,
    update,
    del,
    getProductsByCerID
};


// Start : Handler list method
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
                name: re
            }
        ]
    }
    Certificate.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'certificate'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });

}


function edit (request, reply) {
    const certificate = request.pre.certificate;
    if (certificate) {
        return reply(certificate)
    } else {
        reply(Boom.notFound('Certificate is not found'));
    }
}



function save (request, reply) {
    let certificate = new Certificate(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'certificate',
        JSON.stringify({ new: certificate, old: null }),
        'add new certificate'
    );
    let promise = certificate.save();
    promise.then(function (certificate) {
        reply(certificate);
    }).catch(function (err) {
        request.log(['error', 'certificate'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update (request, reply) {
    let certificate = request.pre.certificate;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'certificate',
        JSON.stringify({ new: _.extend(certificate, request.payload), old: certificate }),
        'update certificate'
    );
    certificate = _.extend(certificate, request.payload);
    ;
    let promise = certificate.save();
    promise.then(function (certificate) {
        reply(certificate);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function del (request, reply) {
    const certificate = request.pre.certificate;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'certificate',
        JSON.stringify({ new: null, old: certificate }),
        'delete certificate'
    );
    certificate.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(certificate);
    });
}


function getProductsByCerID(request, reply) {
    let queue = request.server.plugins['hapi-kue'];
    let data = {
        id_cer: request.params.id || request.payload.id,
        page : request.query.page,
        limit : parseInt(request.query.limit)
    }
    productHelper.getProductsByCerID(data,function(resp){
        reply(resp);
    });
}





