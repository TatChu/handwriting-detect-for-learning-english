'use strict';

const _ = require('lodash');
const async = require("async");
const moment = require("moment");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const Blog = mongoose.model('Blog');
const Vocabulary = mongoose.model('Vocabulary');

module.exports = {
	index,
	dashboard,
};

function index(request, reply) {
	let config = request.server.configManager;

	if (!request.auth.credentials.scope.includes('admin')) {
		if (!request.auth.credentials.scope.includes('super-admin')) {
			return reply.redirect(config.get('web.context.cmsprefix') + '/signin');
		}
	}

	if (!request.auth.isAuthenticated)
		return reply.redirect(config.get('web.context.cmsprefix') + '/signin');

	return reply.view('admin-dashboard/view/default', {}, { layout: 'admin/layout-admin' });
}

function dashboard(request, reply) {
	let dataSend = {
		totalWord: 0,

		totalUser: 0,
		newUser: 0,

		totalUnit: 0,
		totalPost: 0
	}

	let yesterday = moment().subtract(1, 'days').endOf('day');
	User.count({}, function (err, count) {
		dataSend.totalUser = count;
		User.count({ createdAt: { '$gte': yesterday } }, function (err, count) {
			dataSend.newUser = count;
			Vocabulary.count({}, function (err, count) {
				dataSend.totalWord = count;
				Unit.count({}, function (err, count) {
					dataSend.totalUnit = count;
					Blog.count({}, function (err, count) {
						dataSend.totalPost = count;
						return reply(dataSend);
					})
				})
			})
		});
	})
}	