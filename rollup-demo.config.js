import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import alias from 'rollup-plugin-alias'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

const isProd = () => process.env.NODE_ENV === 'production'

const prodPlugins = isProd() ? [uglify(), filesize()]: []

const stdPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**',
    externalHelpers: true
  }),
  alias({
    'mo-vue-dnd': 'src/index.js'
  })
]

const plugins = stdPlugins.concat(prodPlugins)

export default [{
  input: 'examples/nested/src/index.js',
  output:[{
    file: 'examples/nested/dist/bundle.js',
    format: 'umd',
    name: 'dnd-nested',
    globals: {
      vue: 'Vue'
    },
    sourcemap: true
  }],
  plugins,
  external: ['vue', 'global']
}]
