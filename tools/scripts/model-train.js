const ml = require('../../ml/trainModel');
let x = [1, 2, 3, 4, -3, 0];
let xShape = [6, 1];
let y = [1, 3, 5, 7, -7, -1];
let yShape = [6, 1];  

var result = [];

// Make the main function async
async function runTraining() {
  // Create promises for each training run
  let trainingPromises = [];
  
  for (let n = 100; n < 2001; n += 50) {
    ml.newML(x, xShape, y, yShape);
    // Store each promise
    trainingPromises.push(train(n));
  }
  
  // Wait for all training to complete
  await Promise.all(trainingPromises);
  
  // Now print results when everything is done
  for (let i = 0; i < result.length; i++) {
    console.log(`Results for ${100 + i * 50} epochs: ${result[i]}`);
  }
}

async function train(epochs) {
  try {
    const predictions = await ml.trainModel(epochs);
    result.push(predictions); // Simple push, no Promise needed
    return predictions;
  } catch (error) {
    console.error('Error during training:', error);
  }
}

// Run the async function
runTraining();