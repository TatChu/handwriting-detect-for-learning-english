const fs = require('fs');
const Jimp = require("jimp");
const folder = 'image/data training/a/';


fs.readdir(folder, (err, files) => {
    files.forEach(function (file, i) {
        if (file.indexOf('__processed_' != -1)) {
            Jimp.read(folder + file).then(function (image) {
                image.autocrop(function (err, data) {
                    console.log(file);

                    for (var i = 0; i <= 13; i++) {
                        for (var j = 0; j <= 13; j++) {
                            console.log(i, j);
                            this.scan(i * 4, j * 4, i * 4 + 4, j * 4 + 4, function (x, y, idx) {
                            })
                        }
                    }
                    console.log('----------------------');
                });
            });
        }
    })
})