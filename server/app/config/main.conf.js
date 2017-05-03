'use strict';
// const Bluebird = require('bluebird');

let config = {};

config.web = {

    port: process.env.FRONT_PORT || 9020,
    sessionKey: '6ketaq3cgrggdfgdfgdfgdfgo315rk9',
    cookieOptions: {
        ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
        encoding: 'none',    // we already used JWT to encode
        path: '/',
        //isSecure: true,      // warm & fuzzy feelings
        isHttpOnly: false,    // prevent client alteration
        clearInvalid: true, // remove invalid cookies
        strictHeader: true   // don't allow violations of RFC 6265
    },
    paging: {
        defaultPageSize: 25,
        numberVisiblePages: 10,
        itemsPerPage: 10
    },
    db: {
        uri: 'mongodb://localhost/db_english_study',
        // options: {
        //     user: '',
        //     pass: ''
        // },
        prefixCollection: 'bz_'
    },
    elasticsearch: {
        ES_Sync: false,
        config: {
            hosts: [
                {
                    protocol: 'http',
                    host: 'localhost',
                    port: 9200,
                },
            ],
            /*log: 'trace',*/
        }
    },
    mailer: {
        options: {
            pool: true,
            service: 'Gmail',
            auth: {
                user: 'tatchu.it@gmail.com',
                pass: 'english.study.app2017'
            },
            // host: 'smtp.kuikoo.com',
            // port: 465,
            // secure: true,
            // tls: {
            //     rejectUnauthorized: false /* allow invalid certificates*/
            // },
            logger: false, // log to console
            debug: false // include SMTP traffic in the logs
        },
        defaults: {
            from: 'info <sender@gmail.com>'
        }
    },
    email: {
        from: {
            "name": "English Study App",
            "address": "tatchu.it@gmail.com"
        },
        to: [],
        cc: [],
        bcc: []

    },
    log: {
        options: {
            transport: 'console',
            logFilePath: BASE_PATH + '/var/bunyan-log.log'
        }
    },
    redisOptions: {
        host: 'localhost',
        port: 6379,
        detect_buffers: true
    },
    upload: {
        path: process.cwd() + '/public/files',
        postPath: process.cwd() + '/public/files/post/',
        productPath: process.cwd() + '/public/files/product/',
        productContentPath: process.cwd() + '/public/files/product_image_content/',
        productImgPath: '/files/product_image/',

        vocabularyPath: process.cwd() + '/public/files/vocabulary_image/',
        vocabularyImgPath: '/files/vocabulary_image/',

        thumbImgPath: '/public/files/thumb_image/',
        thumbImgContentPath: process.cwd() + '/public/files/thumb_image/',

        tempImgContentPath: process.cwd() + '/public/files/tmp/',
        thumbImgPathProduct: '/public/files/thumb_image/product_image/',
        thumbImgContentPathProduct: process.cwd() + '/public/files/thumb_image/product_image/',
        avatarImgPath: process.cwd() + '/public/files/avatar_image/',
        oldMediaPathProduct: '/files/media_old/product/',
        oldMediaContentPathProduct: process.cwd() + '/public/files/media_old/product/',
        oldMediaPath: '/files/media_old/',
        oldMediaContentPath: process.cwd() + '/public/files/media_old/',


    },
    dirDataTraninng: {
        root: '/public/data-tranning/',
        general: '/public/data-tranning/general/',
    },
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
    allRoles: ['super-admin', 'admin', 'student'],
    jwt: {
        secret: process.env.JWT_SECRET_CMS || 'jKErFlFEktfafasfaKLfghLoPrlafasflsdf0werr'
    },

    error: {
        notfound: {
            url: '/error404' //404 URL
        },
        permission: {
            url: '/error403' //403 URL
        },
        user: {
            login: '/admin/signin' // Login URL
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '714864052026308',
        clientSecret: process.env.FACEBOOK_SECRET || 'd78875d70774594c0b93d646c07cb6ab',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'yXwFK6ff3fOc8dvessqKvd9Z8',
        clientSecret: process.env.TWITTER_SECRET || 'k0w9heOObYwlwchdRBQ6tmHiPQN5O26nwz5XDzxPWPtby6llNx',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '941481178075-mrmusgvq3asuq1relija3smn7psmogkh.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'sSIpuxYkac8r8LgXtVJ9pM6W',
        callbackURL: '/auth/google/callback'
    },

    context: {
        cmsprefix: '/admin',
        apiprefix: '/v1/api',
        app: {
            title: 'English Study System - BossApp ',
            description: 'Dự án hỗ trợ học tiếng anh cho học sinh tiểu học',
            keywords: '',
            og_title: 'English Study System - BossApp ',
            og_description: 'Dự án hỗ trợ học tiếng anh cho học sinh',
            og_image: '/assets/Logo.png',
            og_url: '/',
            og_type: 'website'
        },
        settings: {
            versionJs: '1.162',
            env: 'development',
            server: 'staging', //local, dev, staging, live
            GA: 'NULL',
            GTM: 'NULL',
            facebookId: process.env.FACEBOOK_ID || '870470899727751',
            services: {
                admin: 'http://localhost:9002',
                userApi: 'http://localhost:9001',
                contactApi: 'http://localhost:9001',
                socketApi: 'http://localhost:9001',
                uploadApi: 'http://localhost:9001',
                webUrl: 'http://localhost:9006'
            }

        },
        assets: {
            js: [
            ],
            css: [
            ]
        },
        adminassets: {
            js: [
            ],
            css: [
            ]
        }
    },
    category_level: 5,
    thumb_image_config: {
        product: {
            width: 248,
            height: 248
        }
    }
};

module.exports = config;