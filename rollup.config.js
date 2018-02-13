import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import license from 'rollup-plugin-license'

const pkg = require('./package.json')

const banner = `
mo-vue-dnd v${pkg.version}
(c) 2018 ${pkg.author}
License: ${pkg.license}
`

const configs = {
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
    license({
      banner,
    }),
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
    file: 'dist/test-out.js',
    format: 'cjs'
  },
  ...configs
}*/]
