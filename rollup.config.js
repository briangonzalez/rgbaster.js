import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'rgbaster.js',
  output: {
    file: 'rgbaster.min.js',
    format: 'umd',
    name: 'RGBaster'
  },
  plugins: [  uglify() ]
};