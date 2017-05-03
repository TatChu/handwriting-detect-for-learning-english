const arrays = require('async-arrays').proto();
const cv = require('opencv');
const fs = require('fs');
const Jimp = require('jimp');

const height = 15, width = 10;
const nguong = 128;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);

module.exports = PreProcess;

// 'image/bang chu cai/a.jpg'
// 'a'
// 'image/output/a/'
// function(){}

function PreProcess(imgSrc, character, imgDist, ...callback) {
    cv.readImage(imgSrc, function (err, img) {
        if (err) {
            throw err;
        }
        //Resize anh scan ve 3000x2000
        img.resize(3000, 2000);

        // Chuyen ve anh xam
        img.convertGrayscale();

        // lam mo
        // img.medianBlur(1);

        // khu nhieu gaussian
        // img.gaussianBlur([1, 5]);
        // img.gaussianBlur([3, 3]);

        // Chuyen trang den
        // img = img.adaptiveThreshold(255, 0, 0, 15, 2);

        // khu nhieu
        const lowThresh = 0; // càng lớn càng mất nét
        const highThresh = 250; // cang lon loc cang manh
        img.canny(lowThresh, highThresh);


        // img.erode(0); // xói mòn
        // lam beo chu
        const iterations = 1; // cang lon chu cang beo'
        img.dilate(iterations);
        img.gaussianBlur([3, 3]);

        //Save anh vao thu muc da qua xu ly
        if (!fs.existsSync(imgDist)) {
            fs.mkdirSync(imgDist);
        }

        let distSrc = imgDist + character + '.jpg';
        img.save(distSrc);

        croper(distSrc, character, imgDist, callback[0]);
    })
}



// 'image/bang chu cai/a.jpg'
// 'a'
// 'image/output/a/'
// function(){}
function croper(srcImg, character, imgDist, callback) {
    const size = 14;
    cv.readImage(srcImg, function (err, mat) {

        let crop = function (i, j) {
            if (i > 14) {
                callback();
            } else {

                if (!fs.existsSync(imgDist)) {
                    fs.mkdirSync(imgDist);
                }
                var imgCrop = mat.crop(i * 200 + 10, j * 200 + 30, 140, 140);
                var name = imgDist + character + '_' + (i * 200) + '_' + (j * 200) + '.jpg';

                Jimp.read(imgCrop.toBuffer(), function (err, image) {

                    this.autocrop().resize(width, height).scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

                        var red = this.bitmap.data[idx + 0];
                        var green = this.bitmap.data[idx + 1];
                        var blue = this.bitmap.data[idx + 2];
                        var alpha = this.bitmap.data[idx + 3];
                        let tbc = (red + green + blue) / 3;
                        // chuyen trang den
                        if (tbc < nguong) {
                            image.setPixelColor(whitePixel, x, y);
                        }
                        else {
                            image.setPixelColor(blackPixel, x, y);
                        }
                    }).write(name, function () {

                        if (j < 9) crop(i, j + 1)
                        else crop(i + 1, 0);
                    })
                })
            }
        }

        crop(0, 0);
    });
}

PreProcess('tmp/a.jpg', 'a', 'tmp/a/', function () {
    console.log('DONE');
})