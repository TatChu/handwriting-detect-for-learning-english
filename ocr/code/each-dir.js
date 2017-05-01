const rootFolder = 'image/data training/';
const fs = require('fs');
const Jimp = require("jimp");

let readAllFiles = function (dir, done) {
    fs.readdir(dir, (err, files) => {
        if (files) {

            console.log('|--', dir);
            files.forEach(function (file, index) {
                if (file != '.DS_Store') {
                    console.log('     |');
                    console.log('     |-- ', file);
                    if (file.indexOf('__processed_' == -1)) {
                        Jimp.read(dir + file).then(function (image) {
                            image.autocrop().resize(56, 56).write(dir + "__processed_" + file);
                        });
                    }
                }

            })
        }

        if (typeof done == 'function')
            done(files);
        if (files.length <= 1) {
            console.log('|')
        }
    })
}


fs.readdir(rootFolder, (err, folders) => {

    let i = 0;
    let nextFilesSubDir = function () {
        if (i >= folders.length) {
            console.log('DONE', i);
            return 0;
        }
        else {
            if (folders[i] != '.DS_Store') {
                let subDir = rootFolder + folders[i] + '/';
                ++i;
                readAllFiles(subDir, function (files) {
                    nextFilesSubDir();
                });
            }
            else {
                ++i;
                let subDir = rootFolder + folders[i] + '/';
                ++i;
                readAllFiles(subDir, function (files) {
                    nextFilesSubDir()
                });
            }
        }
    }
    nextFilesSubDir();
})

