var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname),
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/examples/simple/dist/',
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {importLoaders: 1}},
          {loader: 'postcss-loader'}
        ]
      },
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
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      // 'mo-vue-dnd$': path.resolve(__dirname, '../../src/index.js'),
      // 'mo-vue-dnd/index.scss': path.resolve(__dirname, '../../src/index.scss'),
      'mo-vue-dnd$': path.resolve(__dirname, '../../dist/mo-vue-dnd.umd.js'),
      'mo-vue-dnd/index.css': path.resolve(__dirname, '../../dist/index.css'),
    }
  },
  plugins: [],
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

