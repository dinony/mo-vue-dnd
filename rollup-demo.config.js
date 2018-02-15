import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import alias from 'rollup-plugin-alias'

export default [{
  input: 'examples/nested/src/index.js',
  output:[{
    file: 'examples/nested/dist/bundle.js',
    format: 'umd',
    name: 'dnd-nested',
    sourcemap: true
  }],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      externalHelpers: true
    }),
    alias({
      'mo-vue-dnd': 'src/index.js'
    }),
    // uglify(),
    filesize()
  ]
}]
