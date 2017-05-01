const arrays = require('async-arrays').proto();
const cv = require('opencv');
var croperCharacters = require('./auto-crop-opencv');

const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

characters.forAllEmissions(function (character, index, done) {
    let imgDir = 'image/bang chu cai/' + character + '.jpg';
    cv.readImage(imgDir, function (err, img) {
        if (err) {
            throw err;
        }
        const width = img.width();
        const height = img.height();
        if (width < 1 || height < 1) {
            console.log('Image ' + imgDir + ' has no size');
            done();
        }
        img.resize(3000, 2000);
        //chuyen xam
        img.convertGrayscale();
        img.dilate(1); // giản nở
        // img.erode(0); // xói mòn

        // lam mo
        img.medianBlur(1);

        // khu nhieu gaussian
        img.gaussianBlur([1, 5]);


        // XAC DINH BIEN
        // khu nhieu
        const lowThresh = 20; // càng lớn càng mất nét
        const highThresh = 120; // cang lon loc cang manh
        img.canny(lowThresh, highThresh);

        // lam beo chu
        const iterations = 1; // cang lon chu cang beo'
        img.dilate(iterations);

        img.save('image/chu cai trang den/' + character + '.jpg');
        // console.log('Done image ' + imgDist + '');
        let dirSrc = 'image/chu cai trang den/';
        let imgDist = 'image/croped/';
        let nameFileJson = character + '.json';

        croperCharacters(dirSrc, character, imgDist, function () {
            done()
        });
    });
}, function () {
    console.log('OK');
})