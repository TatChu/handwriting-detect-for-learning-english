var Jimp = require("jimp");
const nguong = 128;

Jimp.read('image/output/xu ly 1.jpg', function (err, image) {
    image.autocrop().greyscale().write('camera.jpg', function (err, data) {
        this.scan(0, 0, data.bitmap.width, data.bitmap.height, function (x, y, idx) {
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
            image.filterType(Jimp.PNG_FILTER_PAETH);
        }).write('image/output/xu_ly_2.jpg');
    });
})


// Jimp.read("image/bm.png", function (err, img) {
//     img.autocrop(function (er, data) {
//         this.scan(0, 0, data.bitmap.width, data.bitmap.height, function (x, y, idx) {
//             var red = this.bitmap.data[idx + 0];
//             var green = this.bitmap.data[idx + 1];
//             var blue = this.bitmap.data[idx + 2];
//             var alpha = this.bitmap.data[idx + 3];
//             let tbc = (red + green + blue) / 3;
//             // chuyen trang den
//             let whitePixel = Jimp.rgbaToInt(255, 255, 255, 100);
//             let blackPixel = Jimp.rgbaToInt(0, 0, 0, 100);

//             if (tbc < nguong) {
//                 img.setPixelColor(blackPixel, x, y);

//             }
//             else {
//                 img.setPixelColor(whitePixel, x, y);
//             }
//         }).write('anhdentrang.jpg');
//     });
// })

// Jimp.read("image/bm.png", function (err, image) {
//     if (err) throw err;
//     this.autocrop().scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
//         // x, y is the position of this pixel on the image
//         // idx is the position start position of this rgba tuple in the bitmap Buffer
//         // this is the image
//         var red = this.bitmap.data[idx + 0];
//         var green = this.bitmap.data[idx + 1];
//         var blue = this.bitmap.data[idx + 2];
//         let tbc = (red + green + blue) / 3;
//         // console.log(tbc);
//         // console.log(tbc);
//         var alpha = this.bitmap.data[idx + 3];

//         //chuyen anh xam
//         let hex = Jimp.rgbaToInt(tbc, tbc, tbc, 100);
//         image.setPixelColor(hex, x, y);

//         // console.log(this.bitmap.data[idx]);
//         // chuyen anh den trang
//         if (tbc < 0 || tbc < nguong) {
//             let hex = Jimp.rgbaToInt(255, 255, 255, 255);
//             image.setPixelColor(hex, x, y);

//         }
//         else {
//             let hex = Jimp.rgbaToInt(0, 0, 0, 255);
//             image.setPixelColor(hex, x, y);
//         }


//         // rgba values run from 0 - 255
//         // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
//     }).write('out.png', function (er, data) {
//         this.scan(0, 0, data.bitmap.width, data.bitmap.height, function (x, y, idx) {
//             var red = this.bitmap.data[idx + 0];
//             var green = this.bitmap.data[idx + 1];
//             var blue = this.bitmap.data[idx + 2];
//             var alpha = this.bitmap.data[idx + 3];

//             console.log(red, ' - ', green, ' - ', blue, ' - ', alpha);
//         })
//     });
// });