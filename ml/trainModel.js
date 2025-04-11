const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

function createAudioModel(inputShape, numClasses) {
  const model = tf.sequential();
  
  // Input layer
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: inputShape
  }));
  
  // Hidden layers
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));
  
  // Output layer
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax'
  }));
  
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
}

async function trainAudioModel(model, features, labels, options = {}) {
  const {
    epochs = 50,
    batchSize = 32,
    validationSplit = 0.2,
    verbose = 1
  } = options;
  
  return await model.fit(features, labels, {
    epochs,
    batchSize,
    validationSplit,
    verbose,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 10 === 0 || epoch === epochs - 1) {
          console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    }
  });
}

function predictAudio(model, inputFeatures) {
  const predictions = model.predict(inputFeatures);
  return predictions;
}

async function saveAudioModel(model, savePath) {
  await model.save(`file://${savePath}`);
  console.log(`Model saved to: ${savePath}`);
}

module.exports = {
  createAudioModel,
  trainAudioModel,
  predictAudio,
  saveAudioModel
};