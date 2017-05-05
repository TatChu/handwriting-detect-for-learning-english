// xáo trộn mảng
var shuffle = require('shuffle-array');
let brain = require('brain.js');

// Test nhận dạng chữ
var json = require('./../net.json');
let net = new brain.NeuralNetwork();
net.fromJSON(json);

let dataTest = [
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 0, 1, 1, 1, 1,
    0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
    1, 0, 0, 1, 1, 0, 0, 0, 0, 0,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
let resutl = 'f';
let output = net.run(dataTest);
let numberOut = output.indexOf(Math.max.apply(null, output))

console.log(numberOut);
console.log(output);


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