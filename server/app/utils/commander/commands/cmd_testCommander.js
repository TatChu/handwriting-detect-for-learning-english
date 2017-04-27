const mongoose = require('mongoose');
const Product = mongoose.model('Product');

module.exports = function testCommanderCommand(program) {
	'use strict';

	program
	.command('testCommander <fistname>')
	.description('Say hello to <fistname>')
	.action(function(fistname, command) {
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
				console.log('test',result);
				
				/*Check điều kiện input*/
				if(result.nameRequired == 'test'){
					Product.find()
					.then(function(resp){
						console.log('Hello ' + fistname);

						program.successMessage('%s Done task: %s',fistname, resp.length);
						program.log(fistname);

					}).catch(function(err){
						program.errorMessage('Error %s', err);
						process.exit(1);
					});
				}else{
					program.errorMessage('Error: %s %s',fistname, 'Nhập sai yêu cầu');
					program.log('sai sai sai');
					process.exit(1);
				}
			}
		});
	});

};
