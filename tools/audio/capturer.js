const mic = require('mic');
const fs = require('fs');
const path = require('path');
const { getDefaultDevice } = require('./deviceManager');

// Module state
let micInstance = null;
let outputStream = null;
let currentRecordingPath = null;
let currentDeviceId = 'default';
let outputDir = path.resolve('./recordings');
let isRecording = false;


function selectDevice(deviceId) {
  if (isRecording) {
    console.warn('Cannot change device while recording is active');
    return false;
  }
  
  if (deviceId && typeof deviceId === 'string') {
    currentDeviceId = deviceId;
    console.log(`Selected audio device: ${deviceId}`);
    return true;
  } else {
    console.warn('Invalid device ID. Using default device.');
    currentDeviceId = 'default';
    return false;
  }
}

function setOutputDirectory(dirPath) {
  const resolvedPath = path.resolve(dirPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(resolvedPath)) {
    try {
      fs.mkdirSync(resolvedPath, { recursive: true });
      console.log(`Created directory: ${resolvedPath}`);
    } catch (err) {
      console.error(`Failed to create output directory: ${err.message}`);
      return false;
    }
  }
  
  outputDir = resolvedPath;
  console.log(`Output directory set to: ${outputDir}`);
  return true;
}

async function startRecording(filename = 'recording.wav', options = {}) {
  return new Promise(async (resolve, reject) => {
    if (isRecording) {
      return reject(new Error('Recording already in progress'));
    }

    // Make sure we have a device
    if (currentDeviceId === 'default') {
      try {
        const defaultDevice = await getDefaultDevice();
        if (defaultDevice) {
          currentDeviceId = defaultDevice.id;
          console.log(`Using default device: ${defaultDevice.name}`);
        }
      } catch (err) {
        // Continue with 'default' if we can't get a specific default device
        console.log('Could not identify specific default device, using system default');
      }
    }
    
    // Prepare output file path
    const outputFileName = filename.endsWith('.wav') ? filename : `${filename}.wav`;
    const outputPath = path.join(outputDir, outputFileName);
    currentRecordingPath = outputPath;
    
    // Create a writable stream for the output file
    try {
      outputStream = fs.createWriteStream(outputPath);
    } catch (err) {
      return reject(new Error(`Failed to create output file: ${err.message}`));
    }
    
    // Configure mic instance
    const micOptions = {
      rate: options.sampleRate || '16000',
      channels: options.channels || '1',
      bitwidth: options.bitDepth || '16',
      encoding: 'signed-integer',
      device: currentDeviceId,
      fileType: 'wav',
      endian: 'little'
    };
    
    try {
      micInstance = mic(micOptions);
      const micInputStream = micInstance.getAudioStream();
      
      // Set up event handlers
      micInputStream.on('data', (data) => {
        // Just pipe data to output file
      });
      
      micInputStream.on('error', (err) => {
        console.error('Error in microphone input stream:', err);
        cleanup();
        reject(new Error(`Recording error: ${err.message}`));
      });
      
      micInputStream.on('startComplete', () => {
        isRecording = true;
        console.log(`Recording started: ${outputPath}`);
        resolve(outputPath);
      });
      
      // Pipe the microphone input to the file output
      micInputStream.pipe(outputStream);
      
      // Start the microphone
      micInstance.start();
      
      // Handle process termination
      const handleTermination = () => {
        if (isRecording) {
          cleanup();
        }
      };
      
      process.on('SIGINT', handleTermination);
      process.on('SIGTERM', handleTermination);
      
    } catch (err) {
      cleanup();
      reject(new Error(`Failed to start recording: ${err.message}`));
    }
  });
}

function stopRecording() {
  return new Promise((resolve, reject) => {
    if (!isRecording || !micInstance) {
      return reject(new Error('No active recording to stop'));
    }
    
    const recordingPath = currentRecordingPath;
    
    try {
      // Stop the microphone
      micInstance.stop();
      console.log('Microphone stopped');
      
      // Close the output stream with a slight delay to ensure all data is written
      setTimeout(() => {
        cleanup();
        console.log(`Recording saved: ${recordingPath}`);
        resolve(recordingPath);
      }, 500);
      
    } catch (err) {
      cleanup();
      reject(new Error(`Error stopping recording: ${err.message}`));
    }
  });
}

function isCurrentlyRecording() {
  return isRecording;
}

function cleanup() {
  if (outputStream) {
    outputStream.end();
    outputStream = null;
  }
  
  if (micInstance) {
    try {
      micInstance.stop();
    } catch (e) {
      // Ignore errors during cleanup
    }
    micInstance = null;
  }
  isRecording = false;
}

module.exports = {
  selectDevice,
  setOutputDirectory,
  startRecording,
  stopRecording,
  isCurrentlyRecording
};