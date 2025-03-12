const tf = require('@tensorflow/tfjs-node');

var model;
var x, y;
function newML(){
    model = tf.sequential();
    
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    x = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);

    // y = 2x - 1
    y = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
}


async function trainModel() {
    await model.fit(x, y, {
      epochs: 1000,
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 100 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      }
    });
  // Test with 20 and 1 as inputs
  return model.predict(tf.tensor2d([[20], [1]])).dataSync();
  
  console.log('Expected: [39, 1]');
  
  // Show learned weights (should be close to 2 and -1)
  const weights = model.layers[0].getWeights();
  const w = weights[0].dataSync()[0];
  const b = weights[1].dataSync()[0];
  console.log(`Learned model: y = ${w.toFixed(4)}x + ${b.toFixed(4)}`);
}

module.exports = {
    newML,
    trainModel
};



//move \node_modules\@tensorflow\tfjs-node\deps\lib\tensorflow.dll To \node_modules\@tensorflow\tfjs-node\lib\napi-v8\
// if error with 'ERR_DLOPE_FAILED' or 'ERR_MODULE_NOT_FOUND'