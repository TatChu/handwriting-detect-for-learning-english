const mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const Category = mongoose.model('Category');
const categoryData = require('./../data/category.json');

module.exports = function initCategory(program) {
	'use strict';

	program
		.command('initCategory')
		.description('Tạo dữ liệu ban đầu cho category')
		.action(function (command) {
			program.successMessage('Start task init category');
			let createCategory = async(function () {
				try {
					categoryData.category.forEach(function (category) {
						// Check parent category is exist and create
						let parent_category = await(Category.findOne({ name: category.name }));
						if (!parent_category) {
							let new_category = new Category({ name: category.name, parrent_id: null });
							parent_category = await(new_category.save());
							program.successMessage('Tạo category %s thành công', parent_category.name);
						}

						// Check sub category is exist and create
						category.sub_category.forEach(function (sub) {
							let sub_category = await(Category.findOne({ name: sub.name }));
							if (!sub_category) {
								let new_category = new Category({ name: sub.name, parrent_id: parent_category._id });
								let sub_category = await(new_category.save());
								program.successMessage('Tạo category %s thành công', sub_category.name);
							}
						})
					});
				} catch (error) {
					program.errorMessage('Error', error);
				}
				return [];
			});

			createCategory().then(function (resp) {
				program.successMessage('End task init category');
				process.exit(1);
			});
		});
};
