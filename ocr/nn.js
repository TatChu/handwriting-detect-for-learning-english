var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var trainer = new Trainer(myNetwork);

var myNetwork = new Architect.Perceptron(2, 2, 1)
var trainer = new Trainer(myNetwork)

var trainingSet = [
    {
        input: [0, 0],
        output: [0]
    },
    {
        input: [0, 1],
        output: [1]
    },
    {
        input: [1, 0],
        output: [1]
    },
    {
        input: [1, 1],
        output: [0]
    },
]

// trainer.train(trainingSet);

trainer.trainAsync(trainingSet, {
    rate: .05,
    iterations: 20000,
    error: .005,
    shuffle: true,
    log: 1000,
    cost: Trainer.cost.CROSS_ENTROPY,
    schedule: {
        every: 1000, // repeat this task every 500 iterations
        do: function (data) {
            console.log("error", data.error, "iterations", data.iterations, "rate", data.rate);
            // if (someCondition)
            //     return true; // abort/stop training
        }
    }
}).then(function (res) {
    console.log('Done: ', res);
});
