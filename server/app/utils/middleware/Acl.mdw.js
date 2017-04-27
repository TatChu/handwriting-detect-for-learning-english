'use strict';
const _ = require('lodash');
const Boom = require('boom');
const util = require('util');

module.exports = {
	auth,
	acl
};

/******************************************************************
Middleware Auth
*******************************************************************/
function auth(){
	return function(request, reply){
		if(request.auth.isAuthenticated)
			return reply.continue();
		return reply(Boom.forbidden('try again some time, not permission'));
	}
}

/******************************************************************
Middleware ACL
*******************************************************************/
function acl(resources, actions, userId){
	return function(request, reply){
		var acl = request.acl;
		var _userId = userId,
		_actions = actions,
		_resources = resources;

		/* Set user id là session đăng nhập nếu ko có thì xuất lỗi 401*/
		if (!userId) {
			if((request.auth.credentials) && (request.auth.credentials.uid)){
				_userId = request.auth.credentials.uid;
			}else{
				return reply(Boom.unauthorized('User not authenticated'));
			}
		}

		if (!_userId) {
			return reply(Boom.unauthorized('User not authenticated'));
		}

		// request.log(['Warrning', 'mdw', 'acl'], 'Requesting '+_actions+' on '+resources+' by user '+_userId);

		/*Check permission cho router*/
		acl.isAllowed(_userId, resources, _actions, function(err, allowed){
			if (err){
				request.log(['error', 'mdw', 'acl'], err);
				return reply(Boom.badRequest('Error checking permissions to access resources'));
			}else if(allowed === false){
				// request.log(['Warrning', 'mdw', 'acl'], 'Not allowed '+_actions+' on '+resources+' by user '+_userId);
				acl.allowedPermissions(_userId, resources, function(err, obj){
					// request.log(['Warrning', 'mdw', 'acl'], 'Allowed permissions: '+util.inspect(obj));
				});
				return reply(Boom.forbidden('Insufficient permissions to access resources'));
			}else{
				// request.log(['Success', 'mdw', 'acl'], 'Allowed '+_actions+' on '+resources+' by user '+_userId);
				return reply.continue();
			}
		});
	}
}
