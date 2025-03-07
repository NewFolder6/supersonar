const mic = require('mic');
const fs = require('fs');
const path = require('path');

let micInitialized = false;
let micInstance;
let micInputStream;
let outputStream;

// Configure the microphone with proper sample rate
function initializeMic(sampleRate, channels, bitDepth, outputFilePath) {
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    micInstance = mic({
        rate: String(sampleRate),
        channels: String(channels),
        debug: true,
        bitwidth: bitDepth
    });
    
    micInputStream = micInstance.getAudioStream();
    outputStream = fs.createWriteStream(outputFilePath);
    micInputStream.pipe(outputStream);

    // Handle errors
    micInputStream.on('error', (err) => {
        console.error('Error in recording: ', err);
    });
    
    micInitialized = true;
    return { micInstance, micInputStream, outputStream };
}

function startMic() {
    if(!micInitialized) {
        console.error("Microphone not initialized");
        return false;
    }
    micInstance.start();
    return true;
}

function stopMic() {
    if(!micInitialized) {
        console.error("Microphone not initialized");
        return false;
    }
    micInstance.stop();

    setTimeout(() => {
        outputStream.end();
        console.log("Recording saved successfully");
    }, 100);
    return true;
}

// Default settings
const defaultSettings = {
    sampleRate: 44100,
    channels: 1,
    bitDepth: 16
};

module.exports = {
    initializeMic,
    startMic,
    stopMic,
    defaultSettings
};
