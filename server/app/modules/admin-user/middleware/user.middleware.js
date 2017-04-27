'use strict';

const mongoose = require('mongoose');
const representUser = 'roles';

module.exports = {
    getRoles,
}

/**
 * Middleware
 */

function getRoles(request, reply) {
    let acl = request.acl;
    acl.userRoles(representUser, function (err, roles) {
        if (err) return reply.continue();

        return reply(roles);
    });
}
