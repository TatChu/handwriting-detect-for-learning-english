const cv = require('opencv');
const WHITE = [255, 255, 255];
const RED = [255, 0, 0];
const GREEN = [0, 128, 0];
const Jimp = require("jimp");
const nguong = 128;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);
const fs = require('fs');
const jsonfile = require('jsonfile')

const size = 14;
module.exports = croper;

function croper(dirSrc = 'image/chu cai trang den/', imgName = 'a', imgDist = 'image/croped/', callback) {
    var imgSrc = dirSrc + imgName + '.jpg';
    cv.readImage(imgSrc, function (err, mat) {
        // mat.convertGrayscale();
        mat.gaussianBlur([3, 3]);

        // mat.resize(3000, 2000);
        mat.erode(1);
        let newImg = dirSrc + imgName + '_1.jpg';
        mat.save(newImg);

        var dataTrain = {
            input: [],
            output: []
        };

        let crop = function (i, j) {
            if (i > 14) {
                console.log('DONE ', imgSrc);
                callback();
            } else {

                if (!fs.existsSync(imgDist + imgName)) {
                    fs.mkdirSync(imgDist + imgName);
                }
                var imgCrop = mat.crop(i * 200 + 10, j * 200 + 30, 140, 140);
                var name = imgDist + imgName + '/' + imgName + '_' + (i * 200) + '_' + (j * 200) + '.jpg';
                // imgCrop.resize(84, 84);
                // imgCrop.save(name);
                var input = [];
                var output = new Array(27).fill(0);
                output[0] = 1; // ky tu a

                Jimp.read(imgCrop.toBuffer(), function (err, image) {

                    this.autocrop().resize(size, size).scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

                        var red = this.bitmap.data[idx + 0];
                        var green = this.bitmap.data[idx + 1];
                        var blue = this.bitmap.data[idx + 2];
                        var alpha = this.bitmap.data[idx + 3];
                        let tbc = (red + green + blue) / 3;
                        // chuyen trang den
                        if (tbc < nguong) {
                            image.setPixelColor(whitePixel, x, y);
                            input.push(0);
                        }
                        else {
                            image.setPixelColor(blackPixel, x, y);
                            input.push(1);
                        }
                    }).write(name, function () {
                        // console.log(i, j, name, input.length);

                        dataTrain.input.push(input);
                        dataTrain.output.push(output);
                        for (var u = size; u < size * size; u += size) {
                            let row = '';
                            for (var v = u - size; v < u; v++) {
                                row += input[v];
                            }
                            console.log(row);
                        }
                        console.log()
                        console.log()
                        console.log()

                        mat.rectangle([i * 200 + 10, j * 200 + 30], [140, 140], WHITE, 2);
                        if (i == 14 && j == 9) {
                            mat.save('image/view croped/' + imgName + '1.jpg');
                            // var obj = JSON.stringify(dataTrain);
                            // jsonfile.writeFile(imgDist + imgName + '.json', obj, function (err) {
                            //     if (err) console.error(err)
                            //     // callback();
                            // })
                        }

                        if (j < 9) crop(i, j + 1)
                        else crop(i + 1, 0);
                    })
                })
            }
        }
        crop(0, 0);
    });
}

