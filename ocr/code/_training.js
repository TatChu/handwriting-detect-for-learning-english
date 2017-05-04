let brain = require('brain.js');
var mnist = require('mnist');
var fs = require('fs');
var jsonfile = require('jsonfile')
var file = 'net.json'
var shuffle = require('shuffle-array');

var net = new brain.NeuralNetwork({
    hiddenLayers: 100,
    learningRate: 0.2
});

var trainingSet = require('./../tmp/data-training.json');
var testSet = require('./../tmp/data-testing.json');

shuffle(trainingSet)
shuffle(testSet)

net.train(trainingSet, {
    errorThresh: 0.0003,  // error threshold to reach
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

});

console.log('OK: ', OK);
console.log('totalSetTest: ', totalSetTest);
console.log('Percent recognition: ', (OK / totalSetTest) * 100, '%')

var obj = net.toJSON();
jsonfile.writeFile(file, obj, function (err) {
    console.error(err)
})