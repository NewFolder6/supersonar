const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

const audioProcessor = require('../audio/processor');
const normalizer = require('../audio/normalizer');

const ml = require('../../ml/trainModel');
let x = [1, 2, 3, 4, -3, 0];
let xShape = [6, 1];
let y = [1, 3, 5, 7, -7, -1];
let yShape = [6, 1];  

var result = [];

// Configuration
const dataDir = path.join(__dirname, '../../data');
const modelSaveDir = path.join(__dirname, '../../models');

// Ensure model directory exists
if (!fs.existsSync(modelSaveDir)) {
  fs.mkdirSync(modelSaveDir, { recursive: true });
}

async function loadDataset() {
  console.log('Loading dataset...');
  
  try {
    // Load label file
    const labelPath = path.join(dataDir, 'labels.json');
    if (!fs.existsSync(labelPath)) {
      throw new Error(`Label file not found at ${labelPath}`);
    }
    
    const labelData = JSON.parse(fs.readFileSync(labelPath, 'utf8'));
    if (!labelData || !labelData.audioLabels) {
      throw new Error('Invalid label file format');
    }
    
    const { id, file, label } = labelData.audioLabels;
    const audioPath = path.join(dataDir, file);
    
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }
    
    // Extract features from audio
    console.log(`Processing audio file: ${file}`);
    const features = audioProcessor.loadAndProcessAudio(audioPath, {
      melBands: 40,
      normalize: true
    });
    
    const numSamples = 100;
    const featureLength = 40;
    
    // Create dummy training data
    const xs = [];
    const ys = [];
    
    for (let i = 0; i < numSamples; i++) {

      const classLabel = i < numSamples / 2 ? 0 : 1;
      const featureVector = Array(featureLength).fill(0)
        .map(() => Math.random() + (classLabel * 0.5));
      
      xs.push(featureVector);
      ys.push(classLabel);
    }
    
    // Convert to tensors
    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.oneHot(tf.tensor1d(ys, 'int32'), 2); // Binary classification
    
    return {
      xs: xsTensor,
      ys: ysTensor,
      numClasses: 2
    };
  } catch (error) {
    console.error('Error loading dataset:', error);
    throw error;
  }
}

function createModel(inputShape, numClasses) {
  const model = tf.sequential();
  
  // Basic CNN for audio classification
  model.add(tf.layers.reshape({
    targetShape: [inputShape[0], 1],
    inputShape: inputShape
  }));
  
  // 1D convolution layers
  model.add(tf.layers.conv1d({
    filters: 16,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling1d({ poolSize: 2 }));
  
  model.add(tf.layers.conv1d({
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling1d({ poolSize: 2 }));
  
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.25 }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
  
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  return model;
}

async function trainModel(model, dataset, epochs = 50) {
  console.log('Training model...');
  
  const { xs, ys } = dataset;
  
  // Split into training and validation sets
  const splitIdx = Math.floor(xs.shape[0] * 0.8);
  const [xTrain, xVal] = tf.split(xs, [splitIdx, xs.shape[0] - splitIdx]);
  const [yTrain, yVal] = tf.split(ys, [splitIdx, ys.shape[0] - splitIdx]);
  
  await model.fit(xTrain, yTrain, {
    epochs,
    batchSize: 16,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 5 === 0) {
          console.log(`Epoch ${epoch}: loss=${logs.loss.toFixed(4)}, accuracy=${logs.acc.toFixed(4)}, val_accuracy=${logs.val_acc.toFixed(4)}`);
        }
      }
    }
  });
  
  // Evaluate on the validation set
  const evalResult = model.evaluate(xVal, yVal);
  console.log(`\nFinal evaluation: loss=${evalResult[0].dataSync()[0].toFixed(4)}, accuracy=${evalResult[1].dataSync()[0].toFixed(4)}`);
  
  return model;
}

async function saveModel(model) {
  const modelPath = path.join(modelSaveDir, 'sound_classifier');
  await model.save(`file://${modelPath}`);
  console.log(`Model saved to ${modelPath}`);
}

async function main() {
  try {
    // Load and preprocess data
    const dataset = await loadDataset();
    
    // Create model
    const inputShape = [dataset.xs.shape[1]];
    const model = createModel(inputShape, dataset.numClasses);
    model.summary();
    
    // Train model
    await trainModel(model, dataset);
    
    // Save model
    await saveModel(model);
    
    console.log('Training complete!');
  } catch (error) {
    console.error('Error during training:', error);
  }
}

// Run the training process
main();