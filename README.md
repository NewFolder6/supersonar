# Supersonar

## Overview

Supersonar is an application that uses machine learning to identify sound sources, their directions, and characteristics. Initially focused on processing game audio (Minecraft) to recognize and visualize sound locations in a virtual environment, with plans to expand to real-world audio environments.

## Repository Structure

```plaintext
supersonar/
├── app/               # Main application code
│   ├── client/        # Frontend web interface
@@ -19,9 +20,11 @@ supersonar/
├── package.json       # Root package.json
└── README.md          # Project documentation
```

## Installation

```bash
# Clone the repository
git clone https://github.com/NewFolder6/supersonar.git

# Navigate to project directory
cd supersonar

# Install dependencies
npm install
```

## Dependencies

This project relies on the following npm packages:

- **mineflayer**: ^4.26.0 - A library for creating Minecraft bots
- **mic**: ^2.1.2 - A microphone audio input capture package for Node.js

## Available Scripts

The following npm scripts are available:

### Start the application

```bash
npm start
```

### List audio devices

```bash
npm run audio:list
```

This command displays all available audio input and output devices on your system.

### Run Minecraft extractor

```bash
npm run minecraft
```

This script connects to a Minecraft server and extracts audio data.

## Audio Utilities

### Audio Device Management

The project includes utilities for managing audio devices:

- Listing available input/output devices
- Selecting devices for recording
- Getting default devices

### Audio Capture

The audio capturer module allows you to:

- Record audio from selected devices
- Set output directories for recordings
- Start/stop recordings

## Example Usage

```javascript
// Import the audio capturer
const audioCapturer = require('./utilities/audio/capturer');

// Set output directory for recordings
audioCapturer.setOutputDirectory('./my-recordings');

// Start recording
audioCapturer.startRecording('test-recording.wav', {
  sampleRate: '44100',
  channels: '2',
  bitDepth: '16'
})
.then(recordingPath => {
  console.log(`Recording started to: ${recordingPath}`);
  
  // Stop recording after 5 seconds
  setTimeout(() => {
    audioCapturer.stopRecording()
      .then(path => console.log(`Recording saved to: ${path}`))
      .catch(err => console.error(`Error stopping recording: ${err.message}`));
  }, 5000);
})
.catch(err => console.error(`Failed to start recording: ${err.message}`));
```
