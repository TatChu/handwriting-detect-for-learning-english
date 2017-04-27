'use strict';

const cookie = require('cookie');
const Bcrypt = require('bcrypt');
const pagination = require('pagination');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const asyncC = require('async');
const Promise = require('bluebird');
const _ = require('lodash');
const aguid = require('aguid');
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const JWT = require('jsonwebtoken');
const Crypto = require('crypto');
const UserEmail = require('../util/user-email');
const UserHelper = require(BASE_PATH + '/app/modules/api-user/util/user.js');
const sanitizeHtml = require('sanitize-html');

const fs = require('fs');

const representUser = 'roles';

module.exports = {
    find,
    findOne,
    create,
    update,
    destroy,
    changeStatus,
    register,
    login,
    logout,
    verifyEmail,
    active,
    facebookLogin,
    googleLogin,
    fogotPassword,
    resetPassword,
    changePassword,
    profile,
    updateFavoriteProduct
};

function find(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let filters = {};
    let Reply = function () {
        return User.find(filters).sort('-createdAt').paginate(page, itemsPerPage, function (err, items, total) {
            if (err || items == null) {
                request.log([
                    'error', 'list', 'user'
                    ], err);
                if (items == null)
                    return reply(Boom.badRequest('Không thể lấy dữ liệu'));

                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let getRoleAndReply = function (index) {
                if (index >= items.length) {
                    let totalPage = Math.ceil(total / itemsPerPage);
                    let dataRes = {
                        status: 1,
                        totalItems: total,
                        totalPage: totalPage,
                        currentPage: page,
                        itemsPerPage: itemsPerPage,
                        numberVisiblePages: numberVisiblePages,
                        items: items
                    };

                    return reply(dataRes);
                }
                else {
                    acl.userRoles('' + items[index]._id, function (err, roles) {
                        if (roles) {
                            items[index] = items[index].toObject();
                            items[index].roles = roles;
                        }

                        getRoleAndReply(index + 1);
                    })
                }
            }
            getRoleAndReply(0);
        });
    }


    // Chọn user còn hoạt động
    filters.deletedAt = {
        $eq: undefined
    };

    // Loại bỏ user chỉ định
    if (request.query.uid) {
        filters._id = {
            $ne: request.query.uid
        };
    }

    // Ngày tạo
    if (request.query.createdAt) {
        filters.createdAt = {
            $eq: request.query.createdAt
        };
    }

    // Từ khóa
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'ui');
        filters.$or = [
        {
            name: re
        },
        {
            email: re
        },
        {
            phone: re
        },
        ]

    }

    // Trạng thái kích hoạt
    if (request.query.status) {
        filters.status = {
            $eq: request.query.status
        };
    }

    // Quyền
    let acl = request.acl;
    let filterRole = null;
    if (request.query.role) {
        filterRole = [request.query.role];

        acl.roleUsers(request.query.role, function (err, users) {
            if (users) {
                let keywordQuery = filters.$or;
                filters.$or = [];

                users.forEach(function (id, index) {
                    if (id != 'roles') {
                        if (keywordQuery) {
                            filters.$or.push({
                                $and: [
                                { $or: keywordQuery },
                                { _id: id }
                                ]
                            });
                        }
                        else {
                            filters.$or.push({
                                _id: id
                            });
                        }
                    }
                });

                Reply();
            }
        });
    } else {
        Reply();
    }


}


function findOne(request, reply) {
    let user = request.pre.user;
    if (user) {
        delete user.password;
        delete user.activeToken;
        delete user.password_token;
        delete user.activeToken;
        // delete user.phone;
        // delete user.roles;

        return reply(user);
    } else {
        reply(Boom.notFound('User is not found'));
    }
}


function create(request, reply) {
    if (request.pre.userByPhone) {
        return reply(Boom.badRequest('Phone number already exists.'));
    }
    if (request.payload.password != request.payload.cfpassword) {
        return reply(Boom.badRequest('Passwords did not match.'));
    }
    delete request.payload.cfpassword;

    request.payload.name = sanitizeHtml(request.payload.name);
    request.payload.email = sanitizeHtml(request.payload.email);
    request.payload.phone = sanitizeHtml(request.payload.phone);
    request.payload.vocative = sanitizeHtml(request.payload.vocative);
    request.payload.dob = sanitizeHtml(request.payload.dob);

    if(request.payload.phone == 'null' || request.payload.phone == 'undefined')
        request.payload.phone = null;
    if(request.payload.email == 'null' || request.payload.email == 'undefined')
        request.payload.email = null;
    if(request.payload.dob == 'null' || request.payload.dob == 'undefined')
        request.payload.dob = null;

    let user = new User(request.payload);

    user.provider = 'local';

    user.hashPassword(request.payload.password, function (err, hash) {
        user.password = hash;
        user.activeToken = '';

        const promise = user.save();

        promise.then(user => {
            user = user.toObject();
            delete user.password;

            //@TODOsend email welcome here

            delete user.password;
            delete user.activeToken;
            delete user.phone;
            delete user.roles;

            return reply(user);
        }).catch(err => {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    });
}

function update(request, reply) {
    //không update password
    delete request.payload.password;
    delete request.payload.cfpassword;

    // Nếu user thay đổi email thì kiểm tra trùng email
    if (request.pre.user.email !== request.payload.email) {
        if (request.payload.email !== null && request.payload.email !== "") {
            if (request.pre.userByEmail) {
                return reply(Boom.badRequest("email"));
            }
        }
    }
    // Nếu user thay đổi phone thì kiểm tra trùng phone
    if (request.pre.user.phone !== request.payload.phone) {
        if (request.pre.userByPhone) {
            return reply(Boom.badRequest("phone"));
        }
    }
    // Thay đổi user
    let user = request.pre.user;
    request.pre.user = request.pre.user.toObject();
    
    request.payload.name = sanitizeHtml(request.payload.name);
    request.payload.email = sanitizeHtml(request.payload.email);
    request.payload.phone = sanitizeHtml(request.payload.phone);
    request.payload.vocative = sanitizeHtml(request.payload.vocative);
    request.payload.dob = sanitizeHtml(request.payload.dob);

    if(request.payload.phone == 'null' || request.payload.phone == 'undefined')
        request.payload.phone = null;
    if(request.payload.email == 'null' || request.payload.email == 'undefined')
        request.payload.email = null;
    if(request.payload.dob == 'null' || request.payload.dob == 'undefined')
        request.payload.dob = null;
    
    user = _.extend(user, request.payload);

    let promise = user.save();
    promise.then(function (us) {
        // remove avatar old
        if (user.avatar != request.pre.user.avatar && request.pre.user.avatar != 'avatar.png') {
            let config = request.server.configManager;
            let link = config.get('web.upload.avatarImgPath') + request.pre.user.avatar;
            fs.exists(link, function (exits) {
                if (exits) {
                    fs.unlink(link, (err) => {
                        if (err) { console.log(err) };
                    })
                }
            })
        }

        delete user.password;
        delete user.activeToken;
        delete user.phone;
        delete user.roles;

        return reply(user);
    }).catch(function (err) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });

    // UserHelper.updateUser(request.payload, request.pre.user, function (err, resp) {
    //     if(err)
    //         return reply(Boom.badRequest(err));
    //     return reply(Boom.badRequest(resp));
    // }, request);
}

function destroy(request, reply) {
    User.findOne({ _id: request.params.id }).exec(function (err, doc) {
        if (err)
            return reply(Boom.forbidden("403"));
        doc.deletedAt = new Date();
        doc.save().then(function (doc1) {
            return reply({ success: true });
        }).catch(function (err1) {
            if (err)
                return reply(Boom.forbidden("403"));
        });
    });
}

function changeStatus() {
    return {
        handler: function (request, reply) {
            User.findOne({ _id: request.params.id }).exec(function (err, doc) {
                if (err)
                    return reply(Boom.forbidden("403"));
                doc.status = request.params.status;
                doc.save().then(function (doc1) {
                    return reply({ success: true });
                }).catch(function (err1) {
                    if (err)
                        return reply(Boom.forbidden("403"));
                });
            });
        }
    };
}

function register(request, reply) {
    let acl = request.acl;
    if (request.payload.phone != request.payload.cfphone) {
        return reply(Boom.badRequest('Xác nhận số điện thoại không đúng'));
    }

    if (request.pre.userByPhone) {
        return reply(Boom.badRequest('phone'));
    }

    if (request.payload.email != null && request.payload.email != "") {
        if (request.pre.userByEmail) {
            return reply(Boom.badRequest("email"));
        }
    }

    request.payload.name = sanitizeHtml(request.payload.name);
    request.payload.email = sanitizeHtml(request.payload.email);
    request.payload.phone = sanitizeHtml(request.payload.phone);
    request.payload.vocative = sanitizeHtml(request.payload.vocative);
    request.payload.dob = sanitizeHtml(request.payload.dob)

    if(request.payload.phone == 'null' || request.payload.phone == 'undefined')
        request.payload.phone = null;
    if(request.payload.email == 'null' || request.payload.email == 'undefined')
        request.payload.email = null;
    if(request.payload.dob == 'null' || request.payload.dob == 'undefined')
        request.payload.dob = null;

    UserHelper.createUser(request.payload, request.pre.userByPhone, function (err, resp) {
        if (err)
            return reply(Boom.badRequest(err));
        let acl = request.acl;
        acl.addUserRoles(resp._id.toString(), ["user", "customer"], function (err) {
            if (err)
                return reply(Boom.badRequest(err));

            //send email
            if(resp.email){
                let context = resp;
                let to = { name: resp.name, address: resp.email }
                UserEmail.sendRegisterEmail(request, to, context);
            }
            
            return reply({ phone: resp.phone });
        })
    });
}


function login(request, reply) {
    let cookieOptions = request.server.configManager.get('web.cookieOptions');
    let acl = request.acl;
    let { phone, password, isRegister } = request.payload;
    let optionLogin = {
        // phone: phone,
        // email: phone
        // deletedAt: null
    };
    optionLogin.$or = [
    {
        email: phone
    },
    {
        phone: phone
    }
    ];
    acl.userRoles(representUser, function (err, roles) {
        if (err) {
            // console.log(123,err);
            return reply(Boom.unauthorized(ErrorHandler.getErrorMessage('err')));
        }
        if (roles) {
            // let role = request.server.configManager.get('web.allRoles');
            let role = roles;
            let promise = User.findOne(optionLogin).exec();

            promise.then(user => {
                if (!user || (user && user.status != true)) {
                    return reply(Boom.unauthorized('Email hoặc số điện thoại không đúng'));
                }
                return acl.userRoles(user._id.toString(), function (err, roleUser) {
                    if (err)
                        reply(Boom.unauthorized('Đã xảy ra lỗi. Hãy thử lại'));
                    
                    if (roleUser && _.intersection(roleUser, role).length === 0) {
                        return reply(Boom.unauthorized('Không có quyền'));
                    }

                    if (user.deletedAt != null)
                        return reply(Boom.unauthorized('Tài khoản này đã bị khóa'));

                    user.compare(password, function (err, result) {
                        if (!isRegister) {
                            if (err || !result) {
                                request.log([
                                    'error', 'login'
                                    ], err);
                                return reply(Boom.unauthorized('Mật khẩu không đúng'));
                            }
                        }


                        if (result || isRegister) {
                            var session = {
                                valid: true,
                                uid: user._id.toString(),
                                id: aguid() + '-' + user._id.toString(),
                                name: user.name,
                                phone: user.phone,
                                dob: user.dob,
                                avatar: user.avatar,
                                email: user.email,
                                scope: ['user'], // || user.roles,
                                exp: new Date().getTime() + 30 * 60 * 1000,
                                // Extend
                                // saleman: user.saleman
                            };
                            if (roleUser)
                                session.scope = roleUser;

                            const redisClient = request.server.redis;

                            redisClient.get(request.auth.credentials.id, function (err, credentials) {
                                credentials = JSON.parse(credentials);
                                if (credentials.hasOwnProperty('id_cart'))
                                    session.id_cart = credentials.id_cart;

                                const secret = request.server.configManager.get('web.jwt.secret');

                                redisClient.set(session.id, JSON.stringify(session));

                                var token = JWT.sign(session, secret);
                                // console.log(token, cookieOptions);
                                reply({ token: token }).header('Authorization', token).state('token', token, cookieOptions);
                            })
                        }
                    });
                });
            }).catch(err => {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    })

}

function logout(request, reply) {
    const redisClient = request.server.redis;
    const sessionId = request.auth.credentials.id;
    redisClient.get(sessionId, function (err, result) {
        if (err) {
            request.log([
                'error', 'redis', 'lgout'
                ], err);
        }

        let session = result ?
        JSON.parse(result) : {};
        if (session.id) {
            session.valid = false;
            session.ended = new Date().getTime();
            redisClient.set(session.id, JSON.stringify(session));
        }

    });
    let cookieOptions = request.server.configManager.get('web.cookieOptions');
    reply({ status: true }).header("Authorization", '').unstate('token', cookieOptions);
}

function verifyEmail(request, reply) {
    if (request.pre.userByEmail) {
        return reply({ status: 0, message: 'Email is exist' });
    }
    reply({ status: 1, message: 'Email is not exist' });
}

function active(request, reply) {
    let token = request.query.token;
    let promise = User.findOne({ activeToken: token }).exec();
    promise.then(user => {
        if (!user) {
            return reply(Boom.badRequest('Invalid Token'));
        }
        user.activeToken = '';
        user.status = 1;
        user.save().then(user => {
            reply({ status: 1 });
        }).catch(err => {
            request.log([
                'error', 'active'
                ], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }).catch(err => {
        request.log([
            'error', 'active'
            ], err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}


function facebookLogin(request, reply) {
    let cookieOptions = request.server.configManager.get('web.cookieOptions');
    let { provider_id, email, name, profile_picture } = request.payload;
    let optionLogin = {
        provider_id: provider_id,
        // deletedAt: null
    };
    let acl = request.acl;

    acl.userRoles(representUser, function (err, roles) {
        if (err) {
            return reply(Boom.unauthorized(ErrorHandler.getErrorMessage(err)));
        }
        if (roles) {
            // let role = request.server.configManager.get('web.allRoles');
            let role = roles;
            let promise = User.findOne(optionLogin).exec();

            let saveAndReply = function (user) {

                let prm = user.save();
                prm.then(function (user) {
                    let acl = request.acl;
                    acl.addUserRoles('' + user._id, ['user', 'customer'], function (err) {
                        if (err)
                            return reply(Boom.unauthorized(err));
                        // return reply(resp);
                        acl.userRoles(user._id.toString(), function (err, rolesUser) {

                            if (err)
                                reply(Boom.unauthorized('Không có quyền'));

                            if (role && _.intersection(rolesUser, role).length === 0) {
                                return reply(Boom.unauthorized('Không có quyền'));
                            }

                            var session = {
                                valid: true,
                                uid: user._id.toString(),
                                id: aguid() + '-' + user._id.toString(),
                                name: user.name,
                                email: user.email,
                                scope: rolesUser,
                                exp: new Date().getTime() + 30 * 60 * 1000,
                            };

                            const redisClient = request.server.redis;
                            // Fix save old session id_cart to new session
                            redisClient.get(request.auth.credentials.id, function (err, credentials) {
                                credentials = JSON.parse(credentials);
                                if (credentials.hasOwnProperty('id_cart'))
                                    session.id_cart = credentials.id_cart;
                                const secret = request.server.configManager.get('web.jwt.secret');
                                redisClient.set(session.id, JSON.stringify(session));
                                var token = JWT.sign(session, secret);
                                // console.log(token, cookieOptions);
                                reply({ token: token }).header('Authorization', token).state('token', token, cookieOptions);
                            })
                        }).catch(function (err) {
                            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                        })
                    })


                });
            };

            promise.then(user => {
                if (user !== null) {
                    if (user.status !== true) {
                        return reply(Boom.unauthorized('Tài khoản đã bị khóa'));
                    }
                    if (user.deletedAt != null)
                        return reply(Boom.unauthorized('Tài khoản đã bị xóa'));

                    //update info
                    user = _.extend(user, { provider_id, email, name, profile_picture });
                    saveAndReply(user);
                }
                //Không tìm thấy user bằng provider_id
                else {
                    if (request.pre.userByEmail) {
                        let userByEmail = request.pre.userByEmail;
                        userByEmail.provider = 'facebook';
                        userByEmail.provider_id = provider_id;
                        saveAndReply(userByEmail);
                    }
                    else {
                        // console.info("New user signup by Facebook");
                        let newUser = new User({
                            name: name,
                            email: email,
                            avatar: 'avatar.png',
                            provider_id: provider_id,
                            provider: 'facebook',
                            password: null,
                            roles: [
                            'customer', 'user'
                            ],
                            status: true
                        });

                        newUser.hashPassword(Math.random().toString(36), function (err, hash) {
                            newUser.password = hash;
                            newUser.activeToken = '';

                            saveAndReply(newUser);
                            //send email
                            if(newUser.email){
                                let context = newUser.toObject();
                                let to = { name: newUser.name, address: newUser.email }
                                UserEmail.sendRegisterEmail(request, to, context);
                            }
                        });
                    }

                }

            }).catch(function (err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    });

}

function googleLogin(request, reply) {
    reply();
}


function fogotPassword(request, reply) {
    const config = request.server.configManager;
    const url = config.get('web.context.settings.services.webUrl') + '/khach-hang/dat-lai-mat-khau/';
    const email = request.payload.email;
    const promise = User.findOne({
        email: email
    }, '-password').exec();
    promise.then(user => {
        if (!user) {
            return reply(Boom.notFound('email'));
        }
        const token = Crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 48 * 3600000; // 48 hours
        let promise = user.save();
        promise.then(user => {
            let urlResetPass = url + user.resetPasswordToken;
            let data = { user, urlResetPass };
            //@TODO send email to user
            //send welcome and activation email to user
            UserEmail.sendForgotPasswordEmail(request, {
                name: user.name,
                address: user.email
            }, data);
            return reply({ status: 1 });
        }).catch(err => {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });

        //send email

    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function resetPassword(request, reply) {
    let { newPassword, confirmNewPassword } = request.payload;
    if (newPassword != confirmNewPassword) {
        return reply(Boom.badRequest('Xác nhận password không đúng'));
    }
    let token = request.payload.token;
    if (!token) {
        return reply(Boom.badRequest('Token is empty'));
    }
    let promise = User.findOne({ resetPasswordToken: token }).exec();
    promise.then(user => {
        if (!user) {
            reply(Boom.badRequest('Token is incorrect'));
        }
        user.resetPasswordToken = '';
        user.resetPasswordExpires = null;
        user.hashPassword(newPassword, function (err, hash) {
            user.password = hash;
            //save changed information's user
            user.save().then(user => {
                if (user) {
                    reply({ status: 1, message: 'Đổi password thành công.' });
                }
            }).catch(err => {
                request.log([
                    'error', 'reset'
                    ], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        });
    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });

}

function changePassword(request, reply) {
    let user = request.pre.user;
    if (!user) {
        return reply(Boom.notFound('User không tồn tại'));
    }
    let { currentPassword, newPassword, confirmNewPassword } = request.payload;
    //validate new password and confirm password
    if (newPassword != confirmNewPassword) {
        return reply(Boom.badRequest('Xác nhận password không đúng'));
    }
    //validate current passwordauthenticate
    user.compare(currentPassword, function (err, result) {
        if (err) {
            request.log([
                'error', 'changepassword'
                ], err);
        }
        if (!result) {
            return reply(Boom.badRequest('Mật khẩu cũ không đúng'));
        }
        user.hashPassword(newPassword, function (err, hash) {
            user.password = hash;
            //save changed information's user
            user.save().then(user => {
                if (user) {
                    reply({ status: 1, message: 'Đổi password thành công.' });
                }
            }).catch(err => {
                request.log([
                    'error', 'changepassword'
                    ], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        });
    });
}

function profile(request, reply) {
    let user = request.pre.user;


    if (user) {
        user = user.toObject();
        delete user.password;
        delete user.__v;
        return reply(user);
    }
    return reply(Boom.unauthorized('User is not found'));
}

function updateFavoriteProduct(request, reply) {
    let user = request.pre.user;
    user.favorite_product = request.payload.favorite_product;
    let promise = user.save();
    // Update favorite product user
    promise.then(function (resp) {
        return reply({ success: true })
    })
}