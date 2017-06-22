'use strict';
const Boom = require('boom');
const Joi = require('joi');
const UserHelper = require(BASE_PATH + '/app/modules/api-user/util/user.js');
const representUser = 'roles';
module.exports = {
    create,
    update,

    getAllRole,
    updateFavoriteProduct
};

function create(request, reply) {
    if (request.payload.email != null && request.payload.email != "") {
        if (request.pre.userByEmail) {
            return reply(Boom.badRequest("Email đã tồn tại"));
        }
    }

    UserHelper.createUser(request.payload, request.pre.userByPhone, function (err, resp) {
        if (err)
            return reply(Boom.badRequest(err));
        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'createUser',
            'user',
            JSON.stringify({ new: request.payload, old: null }),
            'create new user'
        );
        let acl = request.acl;
        acl.addUserRoles('' + resp._id, request.payload.roles, function (err) {
            if (err)
                return reply(Boom.badRequest(err));
            return reply(resp);
        })
    });
}


function update(request, reply) {
    // no update password
    delete request.payload.password;
    delete request.payload.cfpassword;
    // Nếu user thay đổi email thì kiểm tra trùng email
    if (request.pre.user.email !== request.payload.email) {
        if (request.payload.email !== null && request.payload.email !== "") {
            if (request.pre.userByEmail) {
                return reply(Boom.badRequest("Email đã tồn tại"));
            }
        }
    }

    /**
     * middleware: remove all roles and set new role to node acl and reply data
     * @param {} error 
     * @param {*} user 
     */

    let setRoleAndReply = function (error, user) {
        if (error || user === null) {
            return reply(Boom.badRequest(error));
        }

        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'updateUser',
            'user',
            JSON.stringify({ new: user, old: request.pre.user, }),
            'update user info'
        );

        let acl = request.acl;
        acl.removeUserRoles(user._id.toString(), request.pre.roles, function (err) {
            if (err)
                return reply(Boom.badRequest(err));
            acl.addUserRoles(user._id.toString(), request.payload.roles, function (err) {
                if (err)
                    return reply(Boom.badRequest(err));
                return reply(user);
            })
        })

    }

    // Nếu user thay đổi phone thì kiểm tra trùng phone
    if (request.pre.user.phone != request.payload.phone) {
        UserHelper.getUser('phone', request.payload.phone, function (err, resp) {
            if (resp) return reply(Boom.badRequest("Phone number has used by another account"));
            else
                UserHelper.updateUser(request.payload, request.pre.user, function (err, resp) {
                    setRoleAndReply(err, resp);
                });
        });
    }
    else
        UserHelper.updateUser(request.payload, request.pre.user, function (err, resp) {
            setRoleAndReply(err, resp);
        });

}

function getAllRole(request, reply) {
    const roles = request.pre.roles;
    let dataReply = {
        success: false,
        data: []
    };

    if (roles) {
        dataReply.success = true;
        dataReply.data = roles;
        return reply(dataReply);
    } else {
        return reply(dataReply);
    }
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