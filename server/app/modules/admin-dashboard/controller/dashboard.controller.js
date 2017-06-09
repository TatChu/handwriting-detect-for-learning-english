'use strict';

const _ = require('lodash');
const async = require("async");
const moment = require("moment");
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
	index,
	dashboard,
};

function index(request, reply) {
    let config = request.server.configManager;

	if (!request.auth.credentials.scope.includes('admin')) {
		if (!request.auth.credentials.scope.includes('super-admin')) {
			return reply.redirect(config.get('web.context.cmsprefix')+'/signin');
		}
	}

	if (!request.auth.isAuthenticated)
		return reply.redirect(config.get('web.context.cmsprefix')+'/signin');

	return reply.view('admin-dashboard/view/default', {}, { layout: 'admin/layout-admin' });
}

function dashboard(request, reply) {
	let dataSend = {
		userRegisterTodayCount: 0,
		totalUserCount: 0,
	}

	let yesterday = moment().subtract(1, 'days').endOf('day');
	User.count({}, function (err, count) {
					dataSend.totalUserCount = count;
					User.count({ createdAt: { '$gte': yesterday } }, function (err, count) {
					dataSend.userRegisterTodayCount = count;
					return reply(dataSend);
				})
				});
}