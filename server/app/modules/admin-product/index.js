'use strict';

const ProductController = require('./controller/product.controller.js');
const ProductMiddleware = require('./middleware/product.middleware.js');
const ProductValidate = require('./validate/product.validate.js');
const promotionHelper = require(BASE_PATH + '/app/modules/admin-promotion/util/promotion.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    let queue = server.plugins['hapi-kue'];
    let productHelper = require('./util/product');

    server.route({
        method: 'GET',
        path: '/product',
        handler: ProductController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'view') },
                { method: ProductMiddleware.getCategoryId, assign: 'getCategoryId' },
                { method: ProductMiddleware.getTag(), assign: 'getTag' }, 
                { method: ProductMiddleware.getTag({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagHighlight' },
                { method: ProductMiddleware.getCategoryWithSub, assign: 'getCategoryWithSub' },
                { method: ProductMiddleware.getPromotionActive, assign: 'getPromotionActive' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'List Product'
        },
    });

    server.route({
        method: 'GET',
        path: '/product-add',
        handler: ProductController.add,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'view') },
                { method: ProductMiddleware.getUnit, assign: 'getUnit' },
                { method: ProductMiddleware.getProduct('list'), assign: 'getListProduct' },
                { method: ProductMiddleware.getCategoryWithSub, assign: 'getCategoryWithSub' },
                { method: ProductMiddleware.getCategory, assign: 'getCategory' },
                { method: ProductMiddleware.getCertificate, assign: 'getCertificate' },
                { method: ProductMiddleware.getProductBalance, assign: 'getProductBalance' },
                { method: ProductMiddleware.getTag({ type: 'CN' }), assign: 'getTag' },
                { method: promotionHelper.getAll, assign: 'getPromotionList' },
                { method: ProductMiddleware.getTag({ type: 'CN' }), assign: 'getTag' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/product',
        handler: ProductController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'add') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: ProductValidate.save,
            tags: ['api'],
            description: 'Create Product'
        }
    });

    server.route({
        method: 'GET',
        path: '/product-edit/{id}',
        handler: ProductController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'view') },
                { method: ProductMiddleware.getUnit, assign: 'getUnit' },
                { method: ProductMiddleware.getProduct('list'), assign: 'getListProduct' },
                { method: ProductMiddleware.getProduct('params'), assign: 'getProductByID' },
                { method: ProductMiddleware.getCategory, assign: 'getCategory' },
                { method: ProductMiddleware.getProductBalance, assign: 'getProductBalance' },
                { method: ProductMiddleware.getCategoryWithSub, assign: 'getCategoryWithSub' },
                { method: promotionHelper.getAll, assign: 'getPromotionList' },
                { method: ProductMiddleware.getCertificate, assign: 'getCertificate' },
                { method: ProductMiddleware.getTag({ type: 'CN' }), assign: 'getTag' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Edit Product'
        }
    });

    server.route({
        method: 'POST',
        path: '/product/{id}',
        handler: ProductController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'edit') },
                { method: ProductMiddleware.getProduct('payload'), assign: 'getProductUpdate' },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Update Product'
        }
    });

    server.route({
        method: 'DELETE',
        path: '/product/{id}',
        handler: ProductController.delete,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'delete') },
                { method: ProductMiddleware.getProduct('params'), assign: 'getProductByID' },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Delete Product'
        }
    });

    server.route({
        method: 'POST',
        path: '/product-active/{id}',
        handler: ProductController.active,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'edit') },
                { method: ProductMiddleware.getProduct('params'), assign: 'getProductByID' },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Active/unactive product'
        }
    });

    server.route({
        method: 'POST',
        path: '/product-tag',
        handler: ProductController.updateTags,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('product', 'edit') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: ProductMiddleware.getProduct('payload'), assign: 'getProductUpdate' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Update tags product'
        }
    });

    queue.processJob('api-procerti', function (job, done) {
        let data = job.data;
        let data_send = productHelper.getProductsByCerID(data, function (resp) {
            console.log(resp);
            done();
        });
    });

    next();
};

exports.register.attributes = {
    name: 'admin-product'
};