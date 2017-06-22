"use strict";

var Joi = require('joi');

function BlogValidate() { };
BlogValidate.prototype = (function () {

	return {
		edit: {
			params: {
				slug: Joi.string().description('Id')
			}
		},
		save: {
			payload: {
				name: Joi.string().required().description('Name'),
				slug: Joi.string().required().description('Slug'),
				type: Joi.string().required().description('Type post'),
				meta_title: Joi.string().allow('').description('Meta title'),
				meta_keywords: Joi.string().allow('').description('Meta keyword'),
				meta_description: Joi.string().allow('').description('Meta description'),
				short_description: Joi.string().allow('').description('Short description'),
				auth_id: Joi.object().description('Author id'),
				publisher_id: Joi.object().description('Author id'),
				content: Joi.string().required().description('Content'),
				auth_id: Joi.string().description('Author ID'),
				featured_image: Joi.array().items(Joi.object().keys({
					url: Joi.string().allow('')
				})).description('List Images'),
				status: Joi.boolean().description('Status'),
				views: Joi.number().description("Count views"),
				tags: Joi.array().items(Joi.string()).description('List Tag'),

				listImgDelete: Joi.array().description('List images need delete'),

				updatedAt: Joi.date().allow('').description('Updated'),
				createdAt: Joi.date().allow('').description('Created')
			}
		},
		update: {
			payload: {
				name: Joi.string().required().description('Name'),
				slug: Joi.string().required().description('Slug'),
				type: Joi.string().required().description('Type post'),
				meta_title: Joi.string().allow('').description('Meta title'),
				meta_keywords: Joi.string().allow('').description('Meta keyword'),
				meta_description: Joi.string().allow('').description('Meta description'),
				short_description: Joi.string().allow('').description('Short description'),
				auth_id: Joi.object().description('Author id'),
				publisher_id: Joi.object().description('Author id'),
				content: Joi.string().required().description('Content'),
				auth_id: Joi.string().description('Author ID'),
				featured_image: Joi.array().items(Joi.object().keys({
					url: Joi.string().allow('')
				})).description('List Images'),
				tags: Joi.array().items(Joi.string()).description('List Tag'),

				status: Joi.boolean().description('Status'),
				views: Joi.number().description("Count views"),

				updatedAt: Joi.date().allow('').description('Updated'),
				createdAt: Joi.date().allow('').description('Created'),

				listImgDelete: Joi.array().description('List images need delete'),

				__v: Joi.any().optional().description('Version Key'),
				_id: Joi.string().description('MongoID')
			}
		},
		deleteItem: {
			params: {
				slug: Joi.string().required().description('ID'),
			}
		}
	};
})();

var blogValidate = new BlogValidate();
module.exports = blogValidate;
