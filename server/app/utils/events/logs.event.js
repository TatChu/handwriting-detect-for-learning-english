// const kue = require('kue')
// const queue = kue.createQueue();
// const Mongoose = require('mongoose');
// const Log = Mongoose.model('Log');

// module.exports = function(type, dataLog){
// 	switch(type) {
// 		case 'log-save': {
// 			let job = queue.create('log_assign_saleman', dataLog).attempts(2).save();
// 			queue.process('log_assign_saleman', function(job, done){
// 				let log = new Log(job.data);
// 				log.save();
// 				done();
// 			});
// 			break;
// 		}
// 		default:
// 		break;
// 	}
// }