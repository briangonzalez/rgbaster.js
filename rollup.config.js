import typescript from 'rollup-plugin-typescript'
import { uglify } from "rollup-plugin-uglify"

export default [
{
  input: './src/index.ts',
  output: {
    format: 'umd',
    name: 'rgbaster',
    file: 'rgbaster.min.js'
  },
  plugins: [
    typescript(),
    uglify()
  ]
}
]
