'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
	index,
};

function index(request, reply) {
	return reply.view('web-index/view/client/home/view', {
		menu: { home: true }
	}, { layout: 'web/layout' });
}