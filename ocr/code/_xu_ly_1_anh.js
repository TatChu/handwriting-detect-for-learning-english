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
                if (typeof callback == 'function') callback();
                else return;
            } else {

                if (!fs.existsSync(imgDist)) {
                    fs.mkdirSync(imgDist);
                }
                var imgCrop = mat.crop(i * 200 + 20, j * 200 + 20, 160, 160);
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

const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let character = 'k';
PreProcess('image/bang chu cai/' + character + '.jpg', character, 'tmp/' + character + '/', 'image/output/' + character + '/', function () {
    console.log('DONE', character);
    done();
})



// // Khai báo tham chiếu thư module
// const cv = require('opencv');
// const Jimp = require('jimp');

// // Đọc ảnh
// var imgSrc = ‘dist/to/img/scan.jpg’;
// cv.readImage(imgSrc, function (err, img) {
//         if (err) {
//             throw err;
//         }
//         //Chỉnh kích thước ảnh scan về 3000x2000
//         img.resize(3000, 2000);

//         // Chuyển sang ảnh xám để xử lý
//         img.convertGrayscale();

//         // Khử nhiễu Gaussian
//         img.gaussianBlur([3, 3]);

//         // Chuyển ảnh trắng đen
//         img = img.adaptiveThreshold(255, 0, 0, 15, 2);

//         // Lọc nhiễu theo ngưỡng
//         const lowThresh = 0;
//         const highThresh = 250
//         img.canny(lowThresh, highThresh);

//         //Lưu ảnh đã xử lý
//         let distSrc = imgDist + character + '.jpg';
//         img.save(distSrc);
//     });
