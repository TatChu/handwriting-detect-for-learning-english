const mongoose = require('mongoose');
const Product = mongoose.model('Product');

module.exports = function demoCommand(program) {
	'use strict';

	program
	.command('demo <name>')
	.description('demo cho team dev')
	.action(function(name, command) {

		program.successMessage('Start task....%s test %s',1, 7);

		/*Nhập input*/
		program.prompt.get({
			properties: {
				nameRequired: {
					description: 'Enter required:',
					// conform: validatePort,
					// pattern: /^\d+$/
				}
			}
		}, function (err, result) {
			if (err) {
				return program.handleError(err);
			} else {

				// console.log('test',result);
				// process.exit(1);
				
				/*Check điều kiện input*/
				if(result.nameRequired == 'test'){
					Product.find()
					.then(function(resp){
					// 	console.log('Hello ' + fistname);

						program.successMessage('%s Done task: %s',name, resp.length);
						process.exit(1);
					// 	program.log(fistname);

					}).catch(function(err){
						program.errorMessage('Error %s', err);
						process.exit(1);
					});
				}else{
					program.errorMessage('Error: %s %s',name, 'Nhập sai yêu cầu');
					program.log('sai sai sai');
					process.exit(1);
				}
			}
		});

	});

};
