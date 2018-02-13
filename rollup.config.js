import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

const configs = {
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
    filesize()
  ],
  external: ['vue']
}

export default [{
  input: 'src/index.js',
  output: [{
    file: 'dist/mo-vue-dnd.cjs.js',
    format: 'cjs'
  },
  {
    file: 'dist/mo-vue-dnd.umd.js',
    format: 'umd',
    name: 'mo-vue-dnd',
    globals: {
      vue: 'Vue'
    }
  },
  {
    file: 'dist/mo-vue-dnd.esm.js',
    format: 'es'
  }],
  ...configs
}, /*{
  input: 'test-src/test.js',
  output: {
    file: 'test-src/dist/out.js',
    format: 'cjs'
  },
  ...configs
}*/]
