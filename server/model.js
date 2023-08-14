const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const math = require('mathjs');
const sk = require('scikitjs');
sk.setBackend(tf)

const model = tf.sequential();
const scaler = new sk.MinMaxScaler();

function createDataset (bars, callback){
    let transformedBars = math.reshape(bars, [bars.length, 1]);
    transformedBars = scaler.fitTransform(transformedBars);
    transformedBars = transformedBars.arraySync();
    transformedBars = math.reshape(transformedBars, [transformedBars.length]);
    let train_set = transformedBars.slice(0, Math.floor(transformedBars.length*0.6));
    let test_set = transformedBars.slice(Math.floor(transformedBars.length*0.6), transformedBars.length+1);
    let train_x = [];
    let train_y = [];
    for (let i = 0; i < train_set.length - 60; i++){
        train_x.push(math.reshape(train_set.slice(i, i+60), [60, 1]));
        train_y.push(train_set[i+60]);
    }
    let test_x = [];
    let test_y = [];
    for (let i = 0; i < test_set.length - 60; i++){
        test_x.push(math.reshape(test_set.slice(i, i+60), [60, 1]));
        test_y.push(test_set[i+60]);
    }
    train_x = tf.tensor(train_x);
    train_y = tf.tensor(train_y);
    test_x = tf.tensor(test_x);
    test_y = tf.tensor(test_y);
    transformedBars = transformedBars.slice(transformedBars.length-60, transformedBars.length);
    transformedBars = math.reshape(transformedBars, [1, transformedBars.length, 1]);
    transformedBars = tf.tensor(transformedBars);
    callback({train_x, train_y, test_x, test_y, transformedBars});
}

model.add(tf.layers.gru({units: 50, returnSequences: true, inputShape : [60,1]}));
model.add(tf.layers.dropout(0.2));
model.add(tf.layers.gru({units: 50, returnSequences: true}));
model.add(tf.layers.dropout(0.2));
model.add(tf.layers.gru({units: 50, returnSequences: true}));
model.add(tf.layers.dropout(0.2));
model.add(tf.layers.gru({units: 50}));
model.add(tf.layers.dropout(0.2));
model.add(tf.layers.dense({units: 1}));

const optim = tf.train.adam(learningRate=0.001);

model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

const batchSize = 32;
const epochs = 5;

function train (x_train, y_train){
    model.fit(x_train, y_train, {batchSize: batchSize, epochs: epochs, shuffle: true, validationSplit: 0.4,  callbacks: {
        onTrainEnd: async function() {
            await model.save('file://./model');
            console.log('Model saved and training complete');
        }
      }
    })
};

async function loadModel () {
    var loadedModel = await tf.loadLayersModel('file://./model/model.json');
    return loadedModel;
};

function predict (x, loadedModel, callback){
    let pred = loadedModel.predict(x);
    callback(pred);
};

function trainModel (bars) {
    createDataset(bars, function(datasets) {
        train(datasets.train_x, datasets.train_y);
    });
};


function runModel (bars, time, callback) {
    createDataset(bars, function(datasets) {
        loadModel().then(function(loadedModel) {
            var currentInput = datasets.transformedBars;
            var predictions = [];
            for (let i = 0; i < time; i++){
                predict(currentInput, loadedModel, function(prediction) {
                        prediction = prediction.arraySync();
                        prediction = prediction[0]
                        predictions.push(prediction[0]);
                        currentInput = currentInput.arraySync();
                        currentInput[0].shift();
                        currentInput[0].push(prediction);
                        currentInput = tf.tensor(currentInput);     
                });
            };
            predictions = math.reshape(predictions, [predictions.length, 1]);
            predictions = tf.tensor(predictions);
            predictions = scaler.inverseTransform(predictions);
            predictions = predictions.arraySync();
            predictions = math.reshape(predictions, [predictions.length]);
            callback({predictions});
        });
        
    });
    
    
}

module.exports = {trainModel , runModel};