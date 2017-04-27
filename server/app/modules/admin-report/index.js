'use strict';

const ReportController = require('./controller/report.controller.js');
const ReportMiddleware = require('./middleware/report.middleware.js');
const ProductMiddleware = require('../admin-product/middleware/product.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    let queue = server.plugins['hapi-kue'];

    server.route({
        method: 'GET',
        path: '/report-product-order',
        handler: ReportController.reportProductOrder,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'view') },
                { method: ProductMiddleware.getCategoryWithSub, assign: 'getCategoryWithSub' },
                { method: ProductMiddleware.getCategoryId, assign: 'getCategoryId' },
            ]
        }
    });

    server.route({
        method: 'GET',
        path: '/report-product-a-day',
        handler: ReportController.reportProductADay,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'view') },
                { method: ReportMiddleware.getCategory, assign: 'getCategory' },
                { method: ProductMiddleware.getCategoryId, assign: 'getCategoryId' },
                { method: ProductMiddleware.getTag(), assign: 'getTag' },
                { method: ProductMiddleware.getTag({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagHighlight' },
                { method: ProductMiddleware.getCategoryWithSub, assign: 'getCategoryWithSub' },
                { method: ProductMiddleware.getPromotionActive, assign: 'getPromotionActive' },
                { method: ReportMiddleware.getConfig({ name: 'onSale_A_Day' }), assign: 'getConfigADay' },
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-report'
};