const tf = require('@tensorflow/tfjs');
const math = require('mathjs');
const sk = require('scikitjs');
const { restClient } = require('@polygon.io/client-js');
import { MongoClient } from 'mongodb';
import React from 'react'
sk.setBackend(tf)

const model = tf.sequential();
const scaler = new sk.MinMaxScaler();
const rest = restClient("RZU2_KdjbQkn968_4PHTUPz0qaEGbRHw");

const mongoClient = new MongoClient('mongodb+srv://admin:Il2dMad@cluster0.epntf2j.mongodb.net/?retryWrites=true&w=majority')

mongoClient.db('testbase').collection('test').find({}).toArray()

async function barMaker(symbol, time){
  currentTime = Date.now();
  var startTime = currentTime - (time * 86400000);
  let data = await rest.stocks.aggregates(symbol, 1, "day", startTime, currentTime).catch(e => {
    console.error('An error happened:', e);
  });
  bars = data.results;
  let bars_close = [];
  for (bar of bars){
    bars_close.push(bar.c);
  };
  return bars_close;
}


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

function train (x_train, y_train, callback){
    model.fit(x_train, y_train, {batchSize: batchSize, epochs: epochs, shuffle: true, validationSplit: 0.4,  callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
      }
    }).then(() => callback());
};

function trainModel (bars, callback) {
    createDataset(bars, function(datasets) {
        train(datasets.train_x, datasets.train_y, function() {
            callback({});
        });
    });
};

var bars = [];
while (true) {
    setTimeout(
        barMaker(ticker, 730).then((data) => {
            bars = data;
            model.trainModel(bars, function(results) {
            });
        }).catch(e => {
            console.error('An error happened:', e);
        })
    , 86400000);
}





