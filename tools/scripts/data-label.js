const normalizer = require('../audio/normalizer');

// Set the output directory for labels
normalizer.newOutputPath('./data/');

// Add multiple labels for different sound files
// normalizer.newLabel(id, filename, label)
normalizer.newLabel(1, 'sound1.raw', "footstep");
normalizer.newLabel(2, 'sound2.raw', "door_open");
normalizer.newLabel(3, 'sound3.raw', "explosion");

console.log("Audio files labeled successfully");