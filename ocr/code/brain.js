let brain = require('brain.js');
var mnist = require('mnist');
var fs = require('fs');
var jsonfile = require('jsonfile')
var file = 'net.json'

var net = new brain.NeuralNetwork({
    hiddenLayers: 100,
    learningRate: 0.2
});
var set = mnist.set(7000, 3000);

var trainingSet = set.training;
var testSet = set.test;

net.train(trainingSet, {
    errorThresh: 0.005,  // error threshold to reach
    iterations: 20000,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 1,       // number of iterations between logging
    learningRate: 0.2   // learning rate
});
let totalSetTest = testSet.length;
let OK = 0;

testSet.forEach(function (item, index) {
    let output = net.run(item.input);
    let numberOut = output.indexOf(Math.max.apply(null, output))
    let numberRes = item.output.indexOf(Math.max.apply(null, item.output));
    if (numberOut == numberRes) OK++;


    console.log('ok: ' + OK + '/' + totalSetTest, 'i: ', + index, 'out: ', numberOut, 'res: ', item.output);
    for (var i = 1; i <= 28; i++) {
        let row = item.input.splice(0, 28);
        for (var j = 0; j <= 27; j++)
            if (row[j] > 0) row[j] = 1;

        console.log(' ' + row[0] + row[1] + row[2] + row[3] + row[4] + row[5] + row[6] + row[7] + row[8] + row[9] + row[10] +
            row[11] + row[12] + row[13] + row[14] + row[15] + row[16] + row[17] + row[18] + row[19] + row[20] + row[21] + row[22] + row[23] + row[24] +
            row[25] + row[26] + row[27])
    }
    console.log();
    console.log();
});

console.log('OK: ', OK);
console.log('totalSetTest: ', totalSetTest);
console.log('Percent recognition: ', (OK / totalSetTest) * 100, '%')

var obj = net.toJSON();
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})