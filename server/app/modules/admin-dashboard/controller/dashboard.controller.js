'use strict';

const _ = require('lodash');
const async = require("async");
const moment = require("moment");
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const User = mongoose.model('User');
const Supplier = mongoose.model('Supplier');

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
		orderTodayCount: 0,
		totalOrderCount: 0,

		userRegisterTodayCount: 0,
		totalUserCount: 0,

		totalProduct: 0,

		totalSupplier: 0,
	}

	let yesterday = moment().subtract(1, 'days').endOf('day');

	async.waterfall(
		[
			function (callback) {
				Order.count({}, function (err, count) {
					dataSend.totalOrderCount = count;
					callback();
				});
			},
			function (callback) {
				Order.count({ createdAt: { '$gte': yesterday } }, function (err, count) {
					dataSend.orderTodayCount = count;
					callback();
				})
			},
			function (callback) {
				User.count({}, function (err, count) {
					dataSend.totalUserCount = count;
					callback();
				});
			},
			function (callback) {
				User.count({ createdAt: { '$gte': yesterday } }, function (err, count) {
					dataSend.userRegisterTodayCount = count;
					callback();
				})
			},
			function (callback) {
				Product.count({}, function (err, count) {
					dataSend.totalProduct = count;
					callback();
				});
			},
			function (callback) {
				Supplier.count({}, function (err, count) {
					dataSend.totalSupplier = count;
					callback(dataSend);
				});
			},

		],
		function (dataSend) {
			return reply(dataSend);
		}
	);
}