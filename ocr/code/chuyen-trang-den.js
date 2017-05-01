var Jimp = require("jimp");
const nguong = 128;
Jimp.read('image/test/img-0_1000.jpg', function (err, image) {
    this.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        image.composite
        image.rgba(false);

        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];
        var alpha = this.bitmap.data[idx + 3];
        let tbc = (red + green + blue) / 3;
        // chuyen trang den
        let whitePixel = Jimp.rgbaToInt(255, 255, 255, 100);
        let blackPixel = Jimp.rgbaToInt(0, 0, 0, 100);

        if (tbc < nguong) {
            image.setPixelColor(whitePixel, x, y);
        }
        else {
            image.setPixelColor(blackPixel, x, y);
        }
    }).write('image/output/trangden.jpg');
});