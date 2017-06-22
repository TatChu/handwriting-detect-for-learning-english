'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

const representUser = 'roles';

module.exports = {
    create,
    getAll,
    removeRole,
    updatePermission,
    getResourceRole,
    addResource,
    removeResource
};

function getAll(request, reply) {
    let acl = request.acl;
    let dataReply = {
        success: false,
        data: []
    };
    acl.userRoles(representUser, function (err, roles) {
        if (err) reply(dataReply);
        let getResources = function (index = 0) {
            if (index == roles.length) {
                dataReply.success = true;
                return reply(dataReply);
            };

            acl.whatResources(roles[index], function (err, resourceAndPermission) {
                let arrayResource = [];
                for (var resource in resourceAndPermission) {
                    arrayResource.push({ resource: resource, permissions: resourceAndPermission[resource] });
                }

                dataReply.data.push({ role: roles[index], resources: arrayResource });
                getResources(index + 1);
            })
        }
        // let get and reply
        getResources(0);
    })
}

function create(request, reply) {
    let { role, permission, resource } = request.payload;
    let acl = request.acl;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'create',
        'permission',
        JSON.stringify({ new: { role, permission, resource }, old: null }),
        'add role'
    );

    acl.addUserRoles(representUser, role, function (error) {
        if (error)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(error)));
        acl.allow(role, resource, permission, function (err) {
            if (err)
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            return reply({
                success: true,
                message: role + ' is allowed ' + permission.join() + ' with: ' + resource.join() + ' resource!'
            })
        })
    })

}

function removeRole(request, reply) {
    let role = request.params.role;
    let acl = request.acl;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'removeRole',
        'permission',
        JSON.stringify({ new: null, old: role }),
        'remove role'
    );

    acl.removeRole(role, function (error) {
        if (error)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(error)));
        acl.removeUserRoles(representUser, [role], function (err) {
            if (err)
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            return reply({ success: true, role: role });
        })

    });
}

function removeResource(request, reply) {
    let resource = request.params.resource;
    let role = request.params.role
    let acl = request.acl;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'removeResource',
        'permission',
        JSON.stringify({ new: null, old: { role, resource } }),
        'remove resource of role'
    );

    acl.whatResources(role, function (err, resp) {
        if (err)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        let permissionAlowed = resp[resource];
        acl.removeAllow(role, resource, permissionAlowed, function (err) {
        })
        acl.removeResource(resource, function (err) {
            if (err)
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            return reply({ success: true, resource: resource });
        });
    })

}

function updatePermission(request, reply) {
    let acl = request.acl;
    let resource = request.params.resource.split(',') || request.payload.resource.split(',');
    let new_permissions = request.payload.permission;
    let role = request.params.role || request.payload.role;

    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'updatePermission',
        'permission',
        JSON.stringify({ new: { new_permissions }, old: { role, resource } }),
        'update permission of resource'
    );

    // get old permission
    acl.allowedPermissions(representUser, resource, function (err, res) {
        if (err)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        // remove old permission
        acl.removeAllow(role, resource, res[resource], function (err) {
            if (err)
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            // set new permission
            acl.allow(role, resource, new_permissions, function (err) {
                if (err)
                    return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                return reply({
                    success: true,
                    message: 'Update role ' + role + ' on ' + resource + ' resource successfully!'
                })
            })

        })
    })
}

function addResource(request, reply) {
    let acl = request.acl;
    let role = request.params.role;
    let resource = request.payload.resource;
    let permissions = request.payload.permission;

    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'addResource',
        'permission',
        JSON.stringify({ new: { role, resource, permissions }, old: null }),
        'add resource for role'
    );

    // add & set new permission for resource
    acl.allow(role, resource, permissions, function (err) {
        if (err)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        return reply({
            success: true,
            message: 'Add resource ' + resource + ' to ' + role + ' successfully'
        })
    })
}

function getResourceRole(request, reply) {
    let acl = request.acl;
    let role = request.params.role || request.payload.role;
    acl.whatResources(role, function (err, resp) {
        if (err)
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        let dataReply = { success: true, data: [] };
        for (var resource in resp) {
            dataReply.data.push({ resource: resource, permissions: resp[resource] });
        }
        return reply(dataReply);
    });
}