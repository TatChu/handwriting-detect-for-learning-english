var dnn = require('dnn');
var x = [[0.4, 0.5, 0.5, 0., 0., 0.],
[0.5, 0.3, 0.5, 0., 0., 0.],
[0.4, 0.5, 0.5, 0., 0., 0.],
[0., 0., 0.5, 0.3, 0.5, 0.],
[0., 0., 0.5, 0.4, 0.5, 0.],
[0., 0., 0.5, 0.5, 0.5, 0.]];
var y = [[1, 0],
[1, 0],
[1, 0],
[0, 1],
[0, 1],
[0, 1]];

var mlp = new dnn.MLP({
    'input': x,
    'label': y,
    'n_ins': 6,
    'n_outs': 2,
    'hidden_layer_sizes': [4, 4, 5]
});

mlp.set('log level', 1); // 0 : nothing, 1 : info, 2 : warning.

mlp.train({
    'lr': 0.6,
    'epochs': 20000
});

a = [[0.5, 0.5, 0., 0., 0., 0.],
[0., 0., 0., 0.5, 0.5, 0.],
[0.5, 0.5, 0.5, 0.5, 0.5, 0.]];

console.log(mlp.predict(a));

// var dnn = require('dnn');
// var trainingSet = require('./../tmp/data-training.json');
// var testSet = require('./../tmp/data-testing.json');

// var input = [];
// trainingSet.forEach(function (item) {
//     input.push(item.input)
// });
// var output = [];
// trainingSet.forEach(function (item) {
//     output.push(item.output)
// });

// var mlp = new dnn.MLP({
//     'input': input,
//     'label': output,
//     'n_ins': 6,
//     'n_outs': 2,
//     'hidden_layer_sizes': [100, 100]
// });

// mlp.set('log level', 1); // 0 : nothing, 1 : info, 2 : warning.

// mlp.train({
//     'lr': 0.3,
//     'epochs': 20000
// });

// let totalSetTest = testSet.length;
// let OK = 0;

// testSet.forEach(function (item, index) {
//     let output_tmp = mlp.predict(a);
//     let numberOut = output_tmp.indexOf(Math.max.apply(null, output))
//     let numberRes = item.output.indexOf(Math.max.apply(null, item.output));
//     if (numberOut == numberRes) OK++;

// });

// console.log('OK: ', OK);
// console.log('totalSetTest: ', totalSetTest);
// console.log('Percent recognition: ', (OK / totalSetTest) * 100, '%')


