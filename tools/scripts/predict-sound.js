const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

const audioProcessor = require('../audio/processor');
const ml = require('../../ml/trainModel');

// Path to your trained model
const modelPath = path.join(__dirname, '../../models/sound_classifier');
// Path to audio file for prediction
const audioFile = path.join(__dirname, '../../data/test-sound.raw');

async function predictSound() {
  try {
    console.log('Loading model...');
    const model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
    
    console.log('Processing audio file...');
    const audioFeatures = audioProcessor.loadAndProcessAudio(audioFile, {
      melBands: 40,
      normalize: true
    });
    
    // Reshape features to match model input shape
    const processedFeatures = audioFeatures.reshape([1, audioFeatures.shape[0]]);
    
    console.log('Making prediction...');
    const prediction = model.predict(processedFeatures);
    const probabilities = prediction.dataSync();
    
    console.log('Prediction results:');
    // Map class indices to class labels (replace with your actual labels)
    const labels = ['class1', 'class2']; 
    
    for (let i = 0; i < probabilities.length; i++) {
      console.log(`${labels[i]}: ${(probabilities[i] * 100).toFixed(2)}%`);
    }
    
  } catch (error) {
    console.error('Error during prediction:', error);
  }
}

// Run the prediction
predictSound();
