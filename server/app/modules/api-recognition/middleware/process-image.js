
const arrays = require('async-arrays').proto();
const cv = require('opencv');
const fs = require('fs');
const Jimp = require('jimp');

const height = 15, width = 10;
const nguong = 128;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);

module.exports = PreProcess;


function PreProcess(imgSrc, character, imgDist, callback) {
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
    })
}

