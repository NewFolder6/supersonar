const path = require('path');
const fs = require('fs');
const converter = require('../audio/converter');

const source = path.join(__dirname, '../../data/recordings/raw/');
const destination = path.join(__dirname, '../../data/recordings/wav/');

fs.readdir(source, (err, files) => {
    if (err) return console.error(err);
    files
        .filter(file => file.endsWith('.raw'))
        .forEach(file => {
            const rawPath = path.join(source, file);
            const wavPath = path.join(destination, file.replace('.raw', '.wav'));
            console.log(`Converting ${rawPath} to ${wavPath}`);
            converter.RawToWav(rawPath, wavPath);
        });
});