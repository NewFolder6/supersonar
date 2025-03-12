const tf = require('@tensorflow/tfjs-node');

const x = tf.tensor1d([0, 1, 2, 3, 4]);
const y = x.mul(tf.scalar(2)).add(tf.scalar(1));
console.log('x:', x.arraySync());
console.log('y:', y.arraySync());