const path = require('path');
const capturer = require('../audio/capturer');


const args = process.argv.slice(2);
const duration = args[0] ? parseInt(args[0]) : 5;

console.log(duration);

const outputDir = path.join(__dirname, '../../recordings/raw');
const timestamp = Date.now();
const outputFilePath = path.join(outputDir, `demo.raw`);

console.log(`Starting recording for ${duration} seconds...`);
console.log(`Output file: ${outputFilePath}`);

// Initialize the microphone
capturer.initializeMic(
    capturer.defaultSettings.sampleRate,
    capturer.defaultSettings.channels, 
    capturer.defaultSettings.bitDepth,
    outputFilePath
);

// Start recording
capturer.startMic();

// Stop after the specified duration
setTimeout(() => {
    console.log(`Recording stopped after ${duration} seconds`);
    capturer.stopMic();
}, duration * 1000);


