'use strict'

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const Path = require('path');
const Pack = require(global.BASE_PATH + '/package');
const Glob = require("glob");

module.exports = function(server) {

    server.register([{
        register: require('inert')
    },
    {
        register: require('vision')
    },
    {
        register: require('hapi-logger'),
        options: {
                //transport: 'console',
                logFilePath: BASE_PATH + '/var/bunyan-log.log'
            }
        },
        {
            register: HapiSwagger,
            options: {
                info: {
                    'title': 'Documentation',
                    'version': Pack.version,
                }
            }
        },
        {
            register: require('../lib/redis.js')
        },
        {
            register: require('../lib/session.js')
        },
        {
            register: require('../lib/mongo.js')
        },
        {
            register: require('../lib/auth.js')
        },
        {
            register: require('../lib/static.js')
        },
        {
            register: require('../lib/hapi-kue/index.js')
        },
        {
            register: require('../lib/hapi-scheduler/index.js')
        },
        {
            register: require('../lib/pubsub.js')
        },
        {
            register: require('../lib/elasticsearch.js')
        },
        {
            register: require('../lib/auditlog.js')
        },
        {
            register: require('../lib/acl.js')
        },
        // {
        //     register: require('hapi-io'),
        //     options: {

        //     }
        // }

        ], (err) => {

            if (err) {
                server.log(['error', 'server'], err);
            }
            const config = server.configManager;
            server.views({
                engines: {
                    html: require('handlebars')
                },
                relativeTo: global.BASE_PATH + '/app/modules',
                partialsPath: global.BASE_PATH + '/app/views/layouts',
                helpersPath: global.BASE_PATH + '/app/views/helpers',
                layoutPath: global.BASE_PATH + '/app/views/layouts',
                layout: function() {
                    return 'web/layout';
                }(),
                context: config.get('web.context')
            });

        //autoload models
        let models = Glob.sync(BASE_PATH + "/app/models/*.model.js", {});
        models.forEach((item) => {
            require(Path.resolve(item));
        });

        //autoload service
        let service = [];
        let serviceName = Glob.sync(BASE_PATH + `/app/utils/service/*.service.js`, {});
        serviceName.forEach((item) => {
            service.push(require(Path.resolve(`${item}`)));
        });
        if (service.length) {
            server.register(service, (err) => {
                if (err) {
                    server.log(['error', 'server'], err);
                }
            });
        }

        //autoload middelware
        let middelware = [];
        let middelwareName = Glob.sync(BASE_PATH + `/app/utils/middelware/*.mdw.js`, {});
        middelwareName.forEach((item) => {
            middelware.push(require(Path.resolve(`${item}`)));
        });
        if (middelware.length) {
            server.register(middelware, (err) => {
                if (err) {
                    server.log(['error', 'server'], err);
                }
            });
        }

        //autoload modules
        server.connections.forEach(function(connectionSetting) {

            let labels = connectionSetting.settings.labels;
            labels.forEach(name => {
                let modules = [];
                let modulesName = Glob.sync(BASE_PATH + `/app/modules/${name}-*/index.js`, {});
                modulesName.forEach((item) => {
                    modules.push(require(Path.resolve(`${item}`)));
                });
                if (modules.length) {
                    let options = { select: [name] };
                    if (name == 'api') {
                        options.routes = { prefix: config.get('web.context.apiprefix') };
                    }
                    if (name == 'admin') {
                        options.routes = { prefix: config.get('web.context.cmsprefix') };
                    }
                    server.register(modules, options, (err) => {
                        if (err) {
                            server.log(['error', 'server'], err);
                        }
                    });
                }
            });
        })

        //Load socket-io
        // var io = require("socket.io")(server.select('socket').listener);
        // require(global.BASE_PATH + '/app/utils/socket.js')(io);
    });
}