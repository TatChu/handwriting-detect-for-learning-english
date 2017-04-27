'use strict';

const UserController = require('./controller/user.controller.js');
const UserMiddleware = require('./middleware/user.middleware.js');;

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/khach-hang/thong-tin-tai-khoan',
        handler: UserController.info
    });

    server.route({
        method: 'GET',
        path: '/khach-hang/so-tay-noi-tro',
        handler: UserController.favoriteProduct
    });

    server.route({
        method: 'GET',
        path: '/khach-hang/dia-chi-giao-hang',
        handler: UserController.shippingAddress,
        config: {
            pre: [
                { method: UserMiddleware.getAllShipping, assign: 'shippingfee' }
                
            ]
        }
    });
    server.route({
        method: 'GET',
        path: '/khach-hang/don-hang-cua-toi',
        handler: UserController.order
    });
    server.route({
        method: 'GET',
        path: '/khach-hang/doi-mat-khau',
        handler: UserController.changePass
    });

    next();
};

exports.register.attributes = {
    name: 'web-user'
};