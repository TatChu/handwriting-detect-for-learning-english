'use strict';

const ProductController = require('./controller/product.controller.js');
const ProductMiddlware = require('./middleware/product.middlware.js');

exports.register = function (server, options, next) {
    const userHelper = require('../api-user/util/user.js');
    const config = server.configManager;

    server.route({
        method: 'GET',
        path: '/danh-muc/{slug}',
        handler: ProductController.category,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('slug'), assign: 'getCategory' },
                { method: ProductMiddlware.getCategory('category'), assign: 'getParentCategory' },
                { method: ProductMiddlware.getTags({ type: 'CN' }), assign: 'getTagsProcessing' },
                { method: ProductMiddlware.getTags({ name: new RegExp('nổi bật', 'i') }), assign: 'getTagsHighlight' },
                { method: ProductMiddlware.getTags({ name: new RegExp('bán chạy', 'i') }), assign: 'getTagsMostSell' },
                { method: ProductMiddlware.getTags({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagsDiscount' },
            ]
        },
    });

    server.route({
        method: 'GET',
        path: '/danh-muc/{category}/{slug}',
        handler: ProductController.category,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('slug'), assign: 'getCategory' },
                { method: ProductMiddlware.getCategory('category'), assign: 'getParentCategory' },
                { method: ProductMiddlware.getTags({ type: 'CN' }), assign: 'getTagsProcessing' },
                { method: ProductMiddlware.getTags({ name: new RegExp('nổi bật', 'i') }), assign: 'getTagsHighlight' },
                { method: ProductMiddlware.getTags({ name: new RegExp('bán chạy', 'i') }), assign: 'getTagsMostSell' },
                { method: ProductMiddlware.getTags({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagsDiscount' },
            ]
        },
    });

    server.route({
        method: 'GET',
        path: '/san-pham/{slug}-{id}',
        handler: ProductController.detail,
        config: {
            pre: [
                { method: ProductMiddlware.getConfig({ name: 'onSale_order_NT' }), assign: 'getConfigOrder1' },
                { method: ProductMiddlware.getConfig({ name: 'onSale_order_BC' }), assign: 'getConfigOrder2' },
                { method: ProductMiddlware.getConfig({ name: 'onSale_order_DT' }), assign: 'getConfigHeader' },
                { method: userHelper.getAuthUser, assign: 'getAuthUser' }
            ]
        },
    });

    server.route({
        method: 'GET',
        path: '/tim-kiem',
        handler: ProductController.search,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('query'), assign: 'findCategory' },
                { method: ProductMiddlware.getCategory('rau-cu'), assign: 'findCategoryRauCu' },
                { method: ProductMiddlware.getTags({ type: 'SP' }), assign: 'getTagsProduct' },
                { method: ProductMiddlware.getTags({ type: 'CN' }), assign: 'getTagsProcessing' },
                { method: ProductMiddlware.getTags({ name: new RegExp('nổi bật', 'i') }), assign: 'getTagsHighlight' },
                { method: ProductMiddlware.getTags({ name: new RegExp('bán chạy', 'i') }), assign: 'getTagsMostSell' },
                { method: ProductMiddlware.getTags({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagsDiscount' },
            ]
        },
    });

    server.route({
        method: 'GET',
        path: '/khuyen-mai',
        handler: ProductController.hightlight,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('rau-cu'), assign: 'findCategoryRauCu' },
                { method: ProductMiddlware.findCategories, assign: 'findCategories' },
                { method: ProductMiddlware.getTags({ type: 'SP' }), assign: 'getTagsProduct' },
                { method: ProductMiddlware.getTags({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagsDiscount' },
                { method: ProductMiddlware.getTags({ type: 'CN' }), assign: 'getTagsProcessing' },
                { method: ProductMiddlware.getPromotionActive, assign: 'getPromotionActive' },
            ]
        },
    });

    server.route({
        method: 'GET',
        path: '/khuyen-mai/{slug}',
        handler: ProductController.hightlight,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('rau-cu'), assign: 'findCategoryRauCu' },
                { method: ProductMiddlware.getCategory('slug'), assign: 'getCategory' },
                { method: ProductMiddlware.findCategories, assign: 'findCategories' },
                { method: ProductMiddlware.getTags({ type: 'SP' }), assign: 'getTagsProduct' },
                { method: ProductMiddlware.getTags({ name: new RegExp('khuyến mãi', 'i') }), assign: 'getTagsDiscount' },
                { method: ProductMiddlware.getTags({ type: 'CN' }), assign: 'getTagsProcessing' },
            ]
        },
    });

    next();
};

exports.register.attributes = {
    name: 'web-product'
};
