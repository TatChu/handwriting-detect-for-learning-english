'use strict';

const Boom = require('boom');
// const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Promise = require("bluebird");
var sharp = require("sharp");

module.exports = {
	uploadFile: uploadFile,
	deleteFile: deleteFile,
	listFile: listFile,
	resizeImage
};

function uploadFile(request) {
	return new Promise(function (resolve, reject) {
		var configManager = request.server.configManager;
		var data = request.payload;

		storage(request, function (filename, uploadPath) {
			var file = fs.createWriteStream(uploadPath);
			file.on('error', function (err) {
				request.log(['error', 'upload'], err);
				return reject(Boom.badRequest(err));
			});
			data.file.pipe(file);
			data.file.on('end', function (err) {
				if (err) {
					request.log(['error', 'upload'], err);
					return reject(err);
				}
				var fileInfo = {
					filename: filename
				};
				return resolve(fileInfo);
			});
		});
	});
}

//Tạo tên file và path upload
var storage = function (request, cb) {
	var data = request.payload;
	var name = (data.prefix || 'file') + '_' + Date.now() + '.' + getFileExt(data.file.hapi.filename);//data.file.hapi.filename;
	var uploadPath = path.join(configManager.get('web.upload.path'), name);
	if (data.type) {
		uploadPath = path.join(configManager.get('web.upload.path'), data.type, name);
		var exist = fs.access(uploadPath, fs.constants.R_OK, (err) => {
			if (!err) {
				/*nếu đã có file thì...(tạo file với tên mới)*/
				// name = data.prefix + '_' + Date.now() + '.' + getFileExt(name);
				uploadPath = path.join(configManager.get('web.upload.path'), data.type, name);
			}

			/*tạo folder nếu chưa có*/
			if (!fs.existsSync(path.join(configManager.get('web.upload.path'), data.type))) {
				mkdirp(path.join(configManager.get('web.upload.path'), data.type), function (err) {
					if (err)
						console.error(err)
					else console.log('pow!')
				});
			}
			cb(name, uploadPath);
		});

	} else {
		var exist = fs.access(uploadPath, fs.constants.R_OK, (err) => {
			if (!err) {
				/*nếu đã có file thì...(tạo file với tên mới)*/
				// name = data.prefix + '_' + Date.now() + '.' + getFileExt(name);
				uploadPath = path.join(configManager.get('web.upload.path'), name);
			}
			/*tạo folder nếu chưa có*/
			if (!fs.existsSync(configManager.get('web.upload.path'))) {
				fs.mkdirSync(configManager.get('web.upload.path'));
				mkdirp(configManager.get('web.upload.path'), function (err) {
					if (err)
						console.error(err)
					else console.log('pow!')
				});
			}
			cb(name, uploadPath);
		});
	}
}

//get file extension
var getFileExt = function (fileName) {
	var fileExt = fileName.split(".");
	if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
		return "";
	}
	return fileExt.pop();
};
//get file upload name - without extension
var getFileName = function (fileName) {
	return fileName.substring(0, fileName.lastIndexOf('.'));
};

var fileValidate = function (fileName, allowExts, cb) {
	var allowExts = allowExts.split(',');
	allowExts = allowExts.map(function (item) {
		return item.trim();
	});
	var fileExt = getFileExt(fileName).toLowerCase();
	if (allowExts.indexOf(fileExt) > -1) {
		cb(null, true);
	}
	cb(null, false);
};

function deleteFile(url, fileName) {
	let link = configManager.get('web.upload.path') + url + fileName;
	fs.exists(link, (exists) => {
		if (exists) {
			fs.unlink(link, (err) => {
				if (err) throw err;
			});
		}
	})
}

function listFile(url) {
	return new Promise(function (resolve, reject) {
		let link = configManager.get('web.upload.path') + url;
		fs.open(link, fs.constants.R_OK, function (err, fd) {
			if (err) {
				return reject(err);
			}
			fs.readdir(link, function (err, files) {
				return resolve(files);
			})
		})
	});
}



/**
 * function resize and delete a file in public/files/tmp
 * @param {*} inputName path fle src
 * @param {*} width 
 * @param {*} height 
 * @param {*} deleteFileSrc true / false
 * @param {*} callback  function return (err, {info: height, width, channels, cropCalcTop, size, ...})
 */
function resizeImage(data) {
	return new Promise(function (resolve, reject) {
		// check exits img
		let { directory, name, width, height, deleteFileSrc, desDirectory, saveToOldDir } = {
			directory: data.directory || '/tmp/',
			name: data.name || null,
			width: data.width || 248,
			height: data.height || 248,
			deleteFileSrc: data.deleteFileSrc || false,
			desDirectory: data.desDirectory || '', // thư mục nơi lưu
			saveToOldDir: data.saveToOldDir || false // nếu không muốn lưu vào thư mục thumb thì truyền vào giá trị true
		}
		let srcFile = configManager.get('web.upload.path') + directory + name;

		let exits = (fs.existsSync(srcFile));
		if (!exits)
			return reject({ success: false, message: 'File does not exits' });
		if (!name)
			return reject({ success: false, message: 'Parameter does not match' });

		let nameSplit = name.split('.');

		// format name output example: oldName_248x248.jpg
		let destPath = configManager.get('web.upload.thumbImgContentPath') + desDirectory;
		if (saveToOldDir) {
			destPath = configManager.get('web.upload.path') + directory;
		}
		let outName = nameSplit[0] + '_' + width + 'x' + height + '.' + nameSplit[nameSplit.length - 1];

		if (!fs.existsSync(configManager.get('web.upload.thumbImgContentPath')))
			fs.mkdirSync(configManager.get('web.upload.thumbImgContentPath'));
		if (!fs.existsSync(destPath))
			fs.mkdirSync(destPath);

		// resize image
		sharp(srcFile).resize(width, height)
			.toFile(destPath + outName, function (err, info) {
				if (err) return reject(err);
				// delete file temp
				if (deleteFileSrc)
					fs.unlinkSync(srcFile);

				let res = {
					success: true,
					filename: outName,
					path: configManager.get('web.upload.thumbImgPath') + desDirectory,
					info,
				};

				return resolve(res);
			})
	});
}