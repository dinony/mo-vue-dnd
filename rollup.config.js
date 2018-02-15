import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import buble from 'rollup-plugin-buble'

const configs = {
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    buble(),
    uglify(),
    filesize()
  ],
  external: ['vue']
}

export default [{
  input: 'src/index.js',
  output: [{
    file: 'dist/mo-vue-dnd.cjs.js',
    format: 'cjs',
    sourcemap: true
  },
  {
    file: 'dist/mo-vue-dnd.umd.js',
    format: 'umd',
    name: 'mo-vue-dnd',
    globals: {
      vue: 'Vue'
    },
    sourcemap: true
  },
  {
    file: 'dist/mo-vue-dnd.esm.js',
    format: 'es',
    sourcemap: true
  }],
  ...configs
}]
