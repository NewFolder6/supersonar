const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');
var outputPath = path.join(projectRoot, 'data', 'labels.json');

function newOutputPath(newPath) {
    // If path is relative, make it absolute
    if (!path.isAbsolute(newPath)) {
        newPath = path.join(projectRoot, newPath);
    }
    
    if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
        newPath = path.join(newPath, 'labels.json');
    }
    
    outputPath = newPath;
    const dir = path.dirname(outputPath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`Output path set to: ${outputPath}`);
}

async function newLabel(id, file, label) {
    try {
        let jsonData = {
            "audioLabels": {
                "id": id,
                "file": file,
                "label": label
            }
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        console.log(`✅ JSON file has been created at: ${outputPath}`);
        
        return outputPath;
    } catch (error) {
        console.error(`❌ Error writing label file: ${error.message}`);
        throw error;
    }
}

module.exports = {
    newOutputPath,
    newLabel
};