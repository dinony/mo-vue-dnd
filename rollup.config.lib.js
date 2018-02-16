import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import buble from 'rollup-plugin-buble'

const isProd = () => process.env.NODE_ENV === 'production'

const prodPlugins = isProd() ? [uglify(), filesize()]: []

const stdPlugins = [
  babel({exclude: 'node_modules/**'}),
  buble()
]

const plugins = stdPlugins.concat(prodPlugins)

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
  plugins,
  external: ['vue']
}]
