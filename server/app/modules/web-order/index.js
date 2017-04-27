'use strict';

const WebOrderController = require('./controller/web_order.controller.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/dat-hang/{params*}',
        handler: WebOrderController.viewOrder
    });

    server.route({
        method: 'GET',
        path: '/dat-hang-thanh-cong/{orderID?}',
        handler: WebOrderController.orderCompeleted
    });

    next();
};

exports.register.attributes = {
    name: 'web-order'
};
