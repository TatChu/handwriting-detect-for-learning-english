'use strict';

const ImportProductController = require('./controller/importProduct.controller.js');
const ImportProductMiddleware = require('./middleware/importProduct.middleware.js');
const ImportProductValidate = require('./validate/importProduct.validate.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/import-product',
        handler: ImportProductController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('import_product', 'view') },
                { method: ImportProductMiddleware.getProductBySlug, assign: 'getProductBySlug' },
                { method: ImportProductMiddleware.getProductByName, assign: 'getProductByName' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Import product page'
        },
    });

    server.route({
        method: 'GET',
        path: '/import-product-add',
        handler: ImportProductController.add,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('import_product', 'view') },
                { method: ImportProductMiddleware.getListProduct, assign: 'getListProduct' },
                { method: ImportProductMiddleware.getListSupplier, assign: 'getListSupplier' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Import product page'
        },
    });

    server.route({
        method: ['POST', 'PUT'],
        path: '/import-product',
        handler: ImportProductController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('import_product', 'add') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: ImportProductMiddleware.getConfig({ name: 'ProductBalance' }), assign: 'getConfig' },
            ],
            validate: ImportProductValidate.save,
            tags: ['api'],
            description: 'Import product'
        },
    });

    // Hide edit import product
    // server.route({
    //     method: 'GET',
    //     path: '/import-product/{id}',
    //     handler: ImportProductController.edit,
    //     config: {
    //         auth: {
    //             strategy: 'jwt',
    //             scope: ['admin']
    //         },
    //         pre: [
    //             { method: AclMiddleware.acl('import_product', 'view') },
    //             { method: ImportProductMiddleware.getListProduct, assign: 'getListProduct' },
    //             { method: ImportProductMiddleware.getListSupplier, assign: 'getListSupplier' },
    //         ],
    //         validate: {

    //         },
    //         tags: ['api'],
    //         description: 'Import product page'
    //     },
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/import-product/{id}',
    //     handler: ImportProductController.update,
    //     config: {
    //         auth: {
    //             strategy: 'jwt',
    //             scope: ['admin']
    //         },
    //         pre: [
    //             { method: AclMiddleware.acl('import_product', 'edit') },
    //             { method: ImportProductMiddleware.getListProduct, assign: 'getListProduct' },
    //             { method: ImportProductMiddleware.getListSupplier, assign: 'getListSupplier' },
    //             { method: ImportProductMiddleware.getConfig({ name: 'ProductBalance' }), assign: 'getConfig' },
    //             { method: ImportProductMiddleware.getImportData, assign: 'getData' },
    //             { method: User.getAuthUser, assign: 'getAuthUser' },
    //         ],
    //         validate: {

    //         },
    //         tags: ['api'],
    //         description: 'Import product page'
    //     },
    // });

    server.route({
        method: 'GET',
        path: '/supplier/import-product/{id}',
        handler: ImportProductController.getDataBySupplier,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('import_product', 'view') },
                { method: ImportProductMiddleware.getProductBySlug, assign: 'getProductBySlug' }
            ],
            validate: {},
            tags: ['api'],
            description: 'List Import product by supplier'
        },
    });

    server.route({
        method: 'DELETE',
        path: '/import-product/{id}',
        handler: ImportProductController.delete,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('import_product', 'delete') },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Delete Product'
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-import-product'
};