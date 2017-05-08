// xáo trộn mảng
var shuffle = require('shuffle-array');
let brain = require('brain.js');

// Test nhận dạng chữ
var json = require('./../net.json');
let net = new brain.NeuralNetwork();
net.fromJSON(json);


let data = require('./../tmp/data-training.json');
console.log(data)
let OK = 0, FAILED = 0;
data.forEach(function (item, index) {
    var output = net.run(item.input);
    let result = item.output;

    if (output.indexOf(Math.max.apply(null, output)) == result.indexOf(Math.max.apply(null, result)))
        OK++;
    else
        FAILED++;
    console.log(index + 1, FAILED, ' : ', OK, ' / ', data.length, ' - ', OK / data.length, '%')
});



// Test ma tran nhi phan

// var data = require('./../tmp/data-testing.json');
// const width = 10, height = 15;
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