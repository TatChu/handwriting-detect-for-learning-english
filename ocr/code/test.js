// xáo trộn mảng
var shuffle = require('shuffle-array');
let brain = require('brain');
const Jimp = require('jimp');
const width = 10, height = 15;
const nguong = 20;

const arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// TEST NHẬN DẠNG CHỮ FROM LOCAL KHÔNG CÓ TRONG BỘ TRAIN VÀ TEST
var json = require('./../net.json');
let net = new brain.NeuralNetwork();
net.fromJSON(json);

const imgSrc = 'tmp/test/processed_tmp_1494496665080.jpg'
let input = [];
Jimp.read(imgSrc, function (err, image) {
    this.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];
        var alpha = this.bitmap.data[idx + 3];
        let tbc = (red + green + blue) / 3;

        if (tbc < nguong) {
            input.push(0);
        }
        else {
            input.push(1);
        }
    }).autocrop(function () {
        for (var u = width; u < height * width; u += width) {
            let row = '';
            for (var v = u - width; v < u; v++) {
                row += input[v];
            }
            console.log(row);
        }

        var output = net.run(input);
        var indexOutput = output.indexOf(Math.max.apply(null, output));
        console.log('DONE: ', indexOutput, arraysChart[indexOutput]);
    })
})



////////////////////////////////////////////////////////////////////////////////////////////////

// Test nhận dạng chữ
// var json = require('./../net.json');
// let net = new brain.NeuralNetwork();
// net.fromJSON(json);


// let data = require('./../tmp/data-training.json');
// console.log(data)
// let OK = 0, FAILED = 0;
// data.forEach(function (item, index) {
//     var output = net.run(item.input);
//     let result = item.output;

//     if (output.indexOf(Math.max.apply(null, output)) == result.indexOf(Math.max.apply(null, result)))
//         OK++;
//     else
//         FAILED++;
//     console.log(index + 1, FAILED, ' : ', OK, ' / ', data.length, ' - ', OK / data.length, '%')
// });

////////////////////////////////////////////////////////////////////////////////////////////////

// Test ma tran nhi phan

// var data = require('./../tmp/data-testing.json');
// // shuffle(data);
// data.forEach(function (item, index) {
//     for (var u = width; u < height * width; u += width) {
//         let row = '';
//         for (var v = u - width; v < u; v++) {
//             row += item.input[v];
//         }
//         console.log(row);
//     }
//     console.log();
//     console.log();
// });