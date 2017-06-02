const fs = require('fs');
const Jimp = require("jimp");
const folder = 'image/test/';
const file = 'img-200_1400.jpg'
const nguong = 128;

let dataTrain = {
    input: [],
    output: new Array(26).fill(0)
};
Jimp.read(folder + file).then(function (image) {
    image.autocrop(function (err, data) {
        image.getBuffer(Jimp.MIME_JPEG, function (err, data) {
            console.log(data);
            data.forEach(function (item, index) {
                console.log(index, item);
            })
        })

        // this.scan(0, 0, image.bitmap.height, image.bitmap.width, function (x, y, idx) {
        //     if (x % 3 == 0 && y % 3 == 0) {
        //         let getFeature = function (m, n) {
        //             let blackPx = 0, whitePx = 0;

        //             var red = image.bitmap.data[idx + 0];
        //             var green = image.bitmap.data[idx + 1];
        //             var blue = image.bitmap.data[idx + 2];

        //             if ((red + blue + green) == 0) //{0,0,0}: BLACK
        //                 ++blackPx;
        //             else ++whitePx // {>0, >0, >0} WHITE

        //             return whitePx;
        //         }

        //         let color = image.getPixelColor(x, y);
        //         var rbga = Jimp.intToRGBA(color);

        //         let totalBlack = getFeature(0, 0) + getFeature(0, 1) + getFeature(0, 2)
        //             + getFeature(1, 0) + getFeature(1, 1) + getFeature(1, 2)
        //             + getFeature(2, 0) + getFeature(2, 1) + getFeature(2, 2);

        //         console.log(x, y, totalBlack)
        //         dataTrain.input.push(totalBlack);
        //     }

        // })

        // for (var l = 0; l < 28; l++) {
        //     var row = '';
        //     for (var m = 0; m < 28; m++) {
        //         if (dataTrain.input[l * m + m] > 0)// đen
        //             dataTrain.input[l * m + m] = '1';
        //         else
        //             dataTrain.input[l * m + m] = '*';//trắng
        //         row += dataTrain.input[l * m + m];
        //     }
        //     console.log(row);

        // }


    });
});