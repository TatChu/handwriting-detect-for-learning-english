'use strict';

let config = {};

config.web = {
    db: {
        uri: 'mongodb://localhost/db_english_study',
        // options: {
        //     user: '',
        //     pass: '',
        //     password: ''
        // },
        prefixCollection: 'tb_'
    },
    elasticsearch: {
        ES_Sync: false,
        prefixIndex: 'dev',
        config: {
            hosts: [{
                protocol: 'http',
                host: 'localhost',
                port: 9200,
            }, ],
            // log: 'trace',
        }
    },
    port: process.env.FRONT_PORT || 9020,
    connections: [
        {
            port: 9020,
            labels: ['web'],
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            }
        },
        {
            port: 9021,
            labels: ['admin'],
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                },
                auth: {
                    scope: ['admin']
                }
            }
        },
        {
            port: 9022,
            labels: 'api',
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            }
        },
        {
            port: 9023,
            labels: 'socket',
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                }
            }
        }
    ],
    context: {
        settings: {
            env: 'development', //'development', //'production'
            facebookId: process.env.FACEBOOK_ID || '1230438623691617',//'870270899727751',
            services: {
                webUrl: 'http://english.study.app.local',
                admin: 'http://english.study.app.local/admin',
                apiUrl: 'http://english.study.app.local/api',
                
                userApi: 'http://english.study.app.local/api',
                logApi: 'http://english.study.app.local/api',
                contactApi: 'http://english.study.app.local/api',
                uploadApi: 'http://english.study.app.local/api',
                socketApi: 'http://english.study.app.local/api',
            }
        }
    }
};

module.exports = config;