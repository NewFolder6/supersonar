const tf = require('@tensorflow/tfjs-node');

const x = tf.tensor1d([0, 1, 2, 3, 4]);
const y = x.mul(tf.scalar(2)).add(tf.scalar(1));
console.log('x:', x.arraySync());
console.log('y:', y.arraySync());

//move \node_modules\@tensorflow\tfjs-node\deps\lib\tensorflow.dll To \node_modules\@tensorflow\tfjs-node\lib\napi-v8\
// if error with 'ERR_DLOPE_FAILED' or 'ERR_MODULE_NOT_FOUND'