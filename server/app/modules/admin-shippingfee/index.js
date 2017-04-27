'use strict';

const ShippingFeeController = require('./controller/shippingfee.controller.js');
const ShippingFeeMiddleware = require('./middleware/shippingfee.middleware.js');
const ShippingFeeValidate = require('./validate/shippingfee.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/shippingfee',
        handler: ShippingFeeController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre:[
                { method: AclMiddleware.acl('shipping','view') }
            ]
        }
    });
    
    server.route({
        method: 'GET',
        path: '/all-shippingfee',
        handler: ShippingFeeController.getAllNoPaging,
    });

    server.route({
        method: 'GET',
        path: '/all-shippingfee-config',
        handler: ShippingFeeController.getShipingFeeConfig,
    });
    
    server.route({
        method: ['GET'],
        path: '/shippingfee/{id}',
        handler: ShippingFeeController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('shipping','view') },
                { method: ShippingFeeMiddleware.getById, assign: 'shippingfee' }
                
            ]
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/shippingfee/{id}',
        handler: ShippingFeeController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('shipping','delete') },
                { method: ShippingFeeMiddleware.getById, assign: 'shippingfee' }
                
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/shippingfee',
        handler: ShippingFeeController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('shipping','add') }
            ],
            validate : ShippingFeeValidate.save
        }

    });
    server.route({
        method: ['PUT'],
        path: '/shippingfee/{id}',
        handler: ShippingFeeController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('shipping', ['edit', 'add']) },
                { method: ShippingFeeMiddleware.getById, assign: 'shippingfee' }
            ],
            validate : ShippingFeeValidate.update
        }

    });
    next();
};

exports.register.attributes = {
    name: 'admin-shippingfee'
};