'use strict';

let config = {};

config.web = {
    db: {
        uri: 'mongodb://localhost/db_english_study',
        options: {
            user: '',
            pass: '',
            password: ''
        },
        prefixCollection: 'tb_'
    },
    elasticsearch: {
        ES_Sync: false,
        config: {
            hosts: [{
                protocol: 'http',
                host: 'localhost',
                port: 9200,
            }, ],
            // log: 'trace',
        }
    },
    context: {
        settings: {
            env: 'development', //'development', //'production',
            facebookId: '427079307489462',
            services: {
                webUrl: '//localhost:9020',
                admin: '//localhost:9021/admin',
                userApi: '//localhost:9022/v1/api',
                apiUrl: '//localhost:9022/v1/api',
                logApi: '//localhost:9022/v1/api',
                
                contactApi: '//localhost:9022/v1/api',
                uploadApi: '//localhost:9022/v1/api',

                socketApi: '//localhost:9023/v1/api',
            }
        }
    }
};

module.exports = config;