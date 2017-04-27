'use strict';

const CertificateController = require('./controller/certificate.controller.js');
const CertificateMiddleware = require('./middleware/certificate.middleware.js');
const CertificateValidate = require('./validate/certificate.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function(server, options, next) {
   var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/certificate',
        handler: CertificateController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('certificate', 'view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/certificate/{id}',
        handler: CertificateController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('certificate', 'view') },
                { method: CertificateMiddleware.getById, assign: 'certificate' }
            ],
            validate: CertificateValidate.edit
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/certificate/{id}',
        handler: CertificateController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('certificate', 'delete') },
                { method: CertificateMiddleware.getById, assign: 'certificate' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/certificate',
        handler: CertificateController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('certificate', 'add') },
            ],
            validate: CertificateValidate.save
        }
    });

    server.route({
        method: ['PUT'],
        path: '/certificate/{id}',
        handler: CertificateController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('certificate', ['edit', 'add']) },
                { method: CertificateMiddleware.getById, assign: 'certificate' }
            ],
            validate: CertificateValidate.update
        }
    });

    server.route({
        method: ['GET'],
        path: '/certificate-product/{id}',
        handler: CertificateController.getProductsByCerID
    });
    next();
};

exports.register.attributes = {
    name: 'admin-certificate'
};