const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

function extractFeatures(audioData, options = {}) {
  const {
    sampleRate = 44100,
    frameSize = 1024,
    hopSize = 512,
    melBands = 40,
    normalize = true
  } = options;

  // Convert raw buffer to float32 array
  const buffer = new Float32Array(audioData.length / 2);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = audioData.readInt16LE(i * 2) / 32768.0;
  }

  // Create tensor from buffer
  const audio = tf.tensor1d(buffer);
  
  // Create spectrogram using STFT
  const spectrogram = tf.signal.stft(audio, frameSize, hopSize);
  
  // Get magnitude spectrogram
  const magSpectrogram = tf.abs(spectrogram);
  
  // Convert to mel-scale if requested
  let features;
  if (melBands > 0) {
    // Create mel filterbank
    const fMin = 0;
    const fMax = sampleRate / 2;
    const nfft = frameSize;
    
    // Simple approximation of mel filterbank
    features = tf.tidy(() => {
      // Log-mel spectrogram (simplified implementation)
      const logMag = tf.log(tf.add(magSpectrogram, 1e-6));
      // We would apply mel filterbank here in a complete implementation
      return tf.div(logMag, tf.scalar(tf.log(10)));
    });
  } else {
    features = magSpectrogram;
  }
  
  if (normalize) {
    const mean = tf.mean(features);
    const std = tf.std(features);
    features = tf.div(tf.sub(features, mean), std);
  }
  
  return features;
}

function loadAndProcessAudio(filePath, options = {}) {
  try {
    const audioData = fs.readFileSync(filePath);
    return extractFeatures(audioData, options);
  } catch (error) {
    console.error(`Error processing audio file ${filePath}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  extractFeatures,
  loadAndProcessAudio
};
