'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
	dictionary,
};

function dictionary(request, reply) {
	return reply.view('web-dictionary/view/client/dictionary/dictionary', {
		menu: { dictionary: true }
	}, { layout: 'web/layout' });
}