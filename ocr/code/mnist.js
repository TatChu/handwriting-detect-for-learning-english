var mnist = require('mnist'); 
var synaptic = require('synaptic'); 

var set = mnist.set(800, 200);

var trainingSet = set.training;
var testSet = set.test;

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

const inputLayer = new Layer(784);
const hiddenLayer = new Layer(100);
const outputLayer = new Layer(10);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

const trainer = new Trainer(myNetwork);

trainer.train(trainingSet, {
    rate: .2,
    iterations: 500,
    error: .01,
    shuffle: true,
    log: 1,
    cost: Trainer.cost.CROSS_ENTROPY,
    schedule: {
        every: 500, // repeat this task every 500 iterations
        do: function (data) {
            console.log("error", data.error, "iterations", data.iterations, "rate", data.rate, " time: ", data);
        }
    }
})

console.log(myNetwork);
console.log(myNetwork.activate(testSet[0].input));
console.log(testSet[0].output);

console.log(myNetwork.activate(testSet[2].input));
console.log(testSet[2].output);