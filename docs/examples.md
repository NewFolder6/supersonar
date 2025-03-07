# Examples

## Audio Recording Example

```javascript
const audioCapturer = require('./tools/audio/capturer');

// Set output directory for recordings
audioCapturer.setOutputDirectory('./recordings');

// Start recording
audioCapturer.startRecording('demo.wav', {
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
