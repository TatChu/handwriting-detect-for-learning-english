'use strict';

const cookie = require('cookie');
const Bcrypt = require('bcrypt');
// const pagination = require('pagination');
const _ = require('lodash');
const Boom = require('boom');
// const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
// const JWT = require('jsonwebtoken');
// const Crypto = require('crypto');
const UserEmail = require('../util/user-email');
const Promise = require("bluebird");

const fs = require('fs');

module.exports = {
    createUser: createUser,
    updateUser: updateUser,

    /*middleware*/
    getAuthUser: getAuthUser,
    getById: getById,
    getUserByEmail: getUserByEmail,
    getUserByPhone: getUserByPhone,
    getUserSaleActive: getUserSaleActive,

    /*helper*/
    hpgetByUserId: hpgetByUserId,

    /*Get document*/
    getUser: getUser

};

function createUser(userData, userByPhone, callback) {

    let resp = {
        userNew: {},
        errors: []
    };

    /*Check Nếu user đã bị deleted thì update và xóa field deleted ngược lại thì email bị trùng*/
    if (userByPhone) {
        if (userByPhone.deletedAt) {
            delete userByPhone.deletedAt;
            return updateUser(userData, userByPhone, function (err, userResp) {
                if (err)
                    return callback(err, null);
                /*unset trường deleteAt của user bị deleted*/
                return restoreUserDeleted(userResp._id).then(function (resp) {
                    callback(null, resp);
                }).catch(function (err) {
                    callback(err, null);
                });
            });
        } else {
            return callback('Số điện thoại đã tồn tại.', null);
        }
    }

    /**/
    if (userData.password != userData.cfpassword) {
        return callback('Xác nhận mật khẩu không đúng', null);
    }
    delete userData.cfpassword;

    let user = new User(userData);

    user.provider = 'local';
    return user.hashPassword(userData.password, function (err, hash) {
        user.password = hash;
        user.activeToken = '';

        const promise = user.save();
        return promise.then(user => {
            user = user.toObject();
            delete user.password;

            /*@TODOsend email welcome here*/
            resp.userNew = user;
            return callback(null, user);
        }).catch(err => {
            return callback(err, null);
        });
    });
}

function updateUser(userData, userOld, callback, request) {

    let user = userOld;

    /*Checks password có hay không khi push lên*/
    if (!userData.password)
        delete userData.password;
    else if (userData.password !== userData.cfpassword)
        callback('Xác nhận mật khẩu không đúng', null);
    delete userData.cfpassword;

    /*Mở rộng và save User*/
    user = _.extend(user, userData);
    let saveUser = function (user) {
        let promise = user.save();
        promise.then(function (user) {
            // delete avatar old file
            if (user.avatar !== userOld.avatar) {
                if (request) {
                    let config = request.server.configManager;
                    fs.unlink(config.get('web.upload.avatarImgPath') + userOld.avatar);
                }
            }

            callback(null, user);
        }).catch(function (err) {
            callback(ErrorHandler.getErrorMessage(err), null);
        });
    };



    if (userData.password) {
        user.hashPassword(userData.password, function (err, hash) {
            user.password = hash;
            saveUser(user);
        });
    }
    else {
        saveUser(user);
    }
}

/******************************************************************
Middleware User
*******************************************************************/
function getAuthUser(request, reply) {
    let id = (request.auth.credentials != null) ? request.auth.credentials.uid : null;
    if (id) {
        User.findOne({ _id: id }, function (err, user) {
            if (err) {
                request.log(['error'], err);
            }
            return reply(user);
        });
    }
    else{
        return reply(null);
    }
}

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = User.findOne({ '_id': id });
    promise.then(function (user) {
        return reply(user);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}

function getUserByEmail(request, reply) {
    const email = request.payload.email;

    User.findOne({ email: email }, function (err, user) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(user);
    });
}

function getUserByPhone(request, reply) {
    const phone = request.payload.phone;

    User.findOne({ phone: phone }, function (err, user) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(user);
    });
}

function getUserSaleActive(request, reply) {
    User.find({ roles: { $in: ['sale'] }, deletedAt: null, status: new Boolean(true), 'saleman.active': new Boolean(true) }, '_id name email')
        .exec(function (err, users) {
            if (err) {
                request.log(['error'], err);
            }

            return reply(users);
        })
}

/**********************************************************
HELPER USER
**********************************************************/
/*Restore user đã bị deleted*/
function restoreUserDeleted(userId) {
    return new Promise(function (resolve, reject) {
        User.findOne({ _id: userId }).exec(function (err, doc) {
            if (err) return reject(err);
            doc.deletedAt = undefined;
            doc.save().then(function (doc1) {
                return resolve(doc1);
            }).catch(function (err1) {
                if (err) return reject(err);
            });
        });
    });
}

function hpgetByUserId(id) {
    id = mongoose.Types.ObjectId(id);

    return new Promise(function (resolve, reject) {
        User.findOne({ _id: id }, '_id name email')
            .exec(function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
    });
}

function getUser(getByField, data, callback) {
    let option = {};
    if (getByField === 'phone')
        option.phone = data;
    if (getByField === 'email')
        option.email = data;
    if (getByField === '_id')
        option._id = data;

    User.findOne(option).exec(function (err, resp) {
        if (err) callback(err, null);
        callback(null, resp);
    })
}

