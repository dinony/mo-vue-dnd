var path = require('path')
var webpack = require('webpack')
var pkg = require('./package.json')

const banner = `
mo-vue-dnd v${pkg.version}
(c) 2018 ${pkg.author}
License: ${pkg.license}
`

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'mo-vue-dnd.umd.js',
    libraryTarget: 'umd',
    library: 'mo-vue-dnd'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {importLoaders: 2}},
          {loader: 'postcss-loader'},
          {loader: 'sass-loader'},
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    vue: 'vue'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    open: false
  },
  performance: {
    hints: false
  },
  devtool: '#source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
