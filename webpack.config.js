var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var isWin = /^win/.test(process.platform)

// Most of the config was copied from js-ipfs-api's webpack configuration

var config = {
  entry: path.join(__dirname,'webapp','app.jsx'),
  output: {
    path: path.join(__dirname,'webapp','dist'),
    filename: 'app.js'
  },
  resolve: {
    modulesDirectories: [
      'node_modules', './webapp/', 'lib', './webapp/components/', './webapp/assets/',
      './webapp/pages/', 'node_modules/font-awesome/css', 'node_modules/font-awesome/fonts'
    ],
    alias: {
      http: 'stream-http',
      https: 'https-browserify'
    }
  },
  module: {
    loaders: [
      { test: /\.(ttf|eot|svg|woff(2?))(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.css$/, loaders: ['style','css'] },
      { test: /\.md$/, loaders: ['html','markdown'] },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015','react'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.js$/,
        include: /node_modules\/(ipfs-api|hoek|qs|boom|wreck)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  externals: {
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Boards',
      template: 'webapp/index.html',
      inject: 'body'
    }),
     new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
     }),
     new webpack.optimize.OccurenceOrderPlugin(),
     new webpack.optimize.DedupePlugin() //,
	 // new webpack.optimize.LimitChunkCountPlugin({
	 // maxChunks: 1
	 //})
  ]
}

config.devServer = {
  // webpack-dev-server -w --progress --devtool eval --port 9090 --quiet --content-base ./webapp/dist
  watch: true,
  progress: true,
  debug: true,
  devtool: 'eval-source',
  port: 9090,
  noInfo: true,
  colors: true,
  inline: true,
  contentBase: config.output.path
},

module.exports = config
