let brain = require('brain.js');
var mnist = require('mnist');
var fs = require('fs');
var jsonfile = require('jsonfile')
var file = 'net1.json'
var shuffle = require('shuffle-array');

const arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var net = new brain.NeuralNetwork({
    hiddenLayers: 80,
    learningRate: 0.4
});

var trainingSet = require('./../tmp/data-training.json');
var testSet = require('./../tmp/data-testing.json');


shuffle(trainingSet)
shuffle(testSet)

let errs = [];

console.time('train: ')
net.train(trainingSet, {
    errorThresh: 0.0001,  // error threshold to reach
    momentum: 0.3,
    iterations: 1000,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 20,       // number of iterations between logging
    callback: function (resp) {
        // console.log(resp);
        errs.push(resp.error);
    }
});

jsonfile.writeFile('errors.json', { values: errs }, function (err) {
    if (err) throw err;
})

console.timeEnd('train: ')
let totalSetTest = testSet.length;
let OK = 0;

let detailTest = {
    count: new Array(26).fill(0), // số mẫu test của 26 ký tự
    ok: new Array(26).fill(0),  // số mẫu đúng tương ứng
}
testSet.forEach(function (item, index) {
    let output = net.run(item.input);
    let numberOut = output.indexOf(Math.max.apply(null, output))
    detailTest.count[numberOut]++;
    let numberRes = item.output.indexOf(Math.max.apply(null, item.output));
    if (numberOut == numberRes) {
        OK++;
        detailTest.ok[numberOut]++;
    }
});

console.log('OK: ', OK);
console.log('totalSetTest: ', totalSetTest);
console.log('Percent recognition: ', (OK / totalSetTest) * 100, '%')
for (var i = 0; i < 26; i++) {
    // console.log(arraysChart[i], ': ', detailTest.ok[i] + '/' + detailTest.count[i] + ' -> ' + (detailTest.ok[i] * 100 / detailTest.count[i]) + ' %')
}
var obj = net.toJSON();
jsonfile.writeFile(file, obj, function (err) {
    if (err) throw err;
})