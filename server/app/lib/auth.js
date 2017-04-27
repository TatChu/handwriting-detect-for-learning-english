'use strict'

const AuthJwt2 = require('hapi-auth-jwt2');
const Pack = require(global.BASE_PATH + '/package');

exports.register = function (server, options, next) {
    var config = server.configManager;

    function validate(decoded, request, callback) {
        const redisClient = server.redis;

        redisClient.get(new String(decoded.id).toString(), function (rediserror, result) {
            if (rediserror) {
                server.log(['error','redis','validateauth'], rediserror);
            }

            let session;
            if (result) {
                session = JSON.parse(result);
            }else{
                return callback(rediserror, false);
            }
            if (session.valid === true) {
                return callback(rediserror, true);
            }else {
                return callback(rediserror, false);
            }
        });
    }

    function registerJwtAuth2(err) {
        if (err) {
            console.log('erro',err);
        }
        server.auth.strategy('jwt', 'jwt', 'optional', {
            key: config.get('web.jwt.secret'), validateFunc: validate,
            errorFunc: function(err){
                console.log('error_auth', err);
            },
            verifyOptions: { ignoreExpiration: false, algorithms: ['HS256'] }
        });

        return next();
    };

    server.register(AuthJwt2, registerJwtAuth2);
};

exports.register.attributes = {
    name: 'app-auth-jwt2',
    dependencies: ['app-redis']
};
