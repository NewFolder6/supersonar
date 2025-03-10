const fs = require('fs');
const path = require('path');

async function RawToWav(rawFilePath, wavFilePath, options = {}) {
    try {
        // Default options
        const sampleRate = options.sampleRate || 44100;
        const channels = options.channels || 1;
        const bitDepth = options.bitDepth || 16;
        
        if (!wavFilePath) {
            wavFilePath = rawFilePath.replace(/\.\w+$/, '') + '.wav';
        }
        
        console.log(`Reading raw file: ${rawFilePath}`);
        const rawData = await fs.promises.readFile(rawFilePath);
        console.log(`Raw data size: ${rawData.length} bytes`);
        
        if (rawData.length === 0) {
            throw new Error(`Raw file is empty: ${rawFilePath}`);
        }
        
        const wavHeader = createWavHeader(rawData.length, sampleRate, channels, bitDepth);
        
        const wavData = Buffer.concat([wavHeader, rawData]);
        console.log(`WAV data prepared: ${wavData.length} bytes`);
        
        // Create the output directory if it doesn't exist
        const outputDir = path.dirname(wavFilePath);
        await fs.promises.mkdir(outputDir, { recursive: true });
        console.log(`Output directory created: ${outputDir}`);
        
        console.log(`Writing WAV file to: ${wavFilePath}`);
        await fs.promises.writeFile(wavFilePath, wavData);
        console.log(`WAV file successfully written: ${wavFilePath}`);
        
        // Verify file was created
        const fileExists = fs.existsSync(wavFilePath);
        if (!fileExists) {
            throw new Error(`WAV file was not found after writing: ${wavFilePath}`);
        }
        
        return wavFilePath;
    } catch (error) {
        console.error(`Error in RawToWav conversion:`, error);
        throw error; // Re-throw to allow caller to handle
    }
}

function createWavHeader(dataLength, sampleRate, channels, bitDepth) {
    const byteRate = sampleRate * channels * (bitDepth / 8);
    const blockAlign = channels * (bitDepth / 8);
    const header = Buffer.alloc(44);
    
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4); // 36 + data size
    header.write('WAVE', 8);
    
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // fmt chunk size
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitDepth, 34);
    
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    
    return header;
}

module.exports = {
    RawToWav
};