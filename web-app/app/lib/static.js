'use strict'

const path = require('path');
// Declare internals
const internals = {};

exports.register = function(server, options, next) {
    let conf = server.configManager;

    /*WEB*/
    /*Truy cập folder public*/
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        },
        config: {
            auth: false
        }
    });
    /* Trong app/module chỉ cho truy cập folder client */
    server.route({
        method: 'GET',
        path: '/modules/{module}/view/client/{pathFile*}',
        handler: function(request, reply) {
            let file = internals.helpers.getClientPath(request, reply);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    /* Trong app/module cho truy cập folder z-share */
    server.route({
        method: 'GET',
        path: '/modules/z-share/{pathFile*}',
        handler: function(request, reply) {
            let file = path.join('app/modules', 'z-share', request.params.pathFile);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    /*END WEB*/

    /*ADMIN*/
    /*Truy cập folder public*/
    server.route({
        method: 'GET',
        path: conf.get('web.context.cmsprefix')+'/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        },
        config: {
            auth: false
        }
    });
    /* Trong app/module chỉ cho truy cập folder client */
    server.route({
        method: 'GET',
        path: conf.get('web.context.cmsprefix')+'/modules/{module}/view/client/{pathFile*}',
        handler: function(request, reply) {
            let file = internals.helpers.getClientPath(request, reply);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    /* Trong app/module cho truy cập folder z-share */
    server.route({
        method: 'GET',
        path: conf.get('web.context.cmsprefix')+'/modules/z-share/{pathFile*}',
        handler: function(request, reply) {
            let file = path.join('app/modules', 'z-share', request.params.pathFile);
            reply.file(file);
        },
        config: {
            auth: false
        }
    });
    /*END ADMIN*/

    return next();
}
exports.register.attributes = {
    name: 'app-static',
    dependencies: 'inert'
};

internals.helpers = {
    getFileExt: function(fileName) {
        var fileExt = fileName.split(".");
        if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
            return "";
        }
        return fileExt.pop();
    },
    getClientPath: function(request, reply) {
        let filePath = path.join('app/modules', request.params.module, 'view', 'client', request.params.pathFile);

        return filePath;
    }
};