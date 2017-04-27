'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
global.BASE_PATH = __dirname;
server.register({
    register: require('hapi-kea-config'),
    options: {
        confPath: BASE_PATH + '/app/config',
        decorateServer: true
    }
});

const config = server.plugins['hapi-kea-config'];
/* Sử dụng trong model và commander*/
global.config = {};
global.config.web = config.get('web');

// console.log("WEB PORT: " + config.get('web.port'));
// console.log('okokoko', config.get('web.context.settings.services'));
/*
server.connection({
    port: parseInt(process.env.PORT, 10) || config.get('web.port'),
});
*/
let connections = config.get('web.connections');
connections.forEach(function (config) {
    server.connection(config);
}, this);

require('./app/bootstrap/bootstrap.js')(server);

//start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    //server.log('info', 'Server running at: ' + server.info.uri);
});

module.exports = server;