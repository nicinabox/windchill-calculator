var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './src/main.js',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }
    ]
  },
  postcss: function() {
    return [
      require('autoprefixer'),
      require('precss')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'FORECAST_API_KEY': JSON.stringify(process.env.FORECAST_API_KEY),
      'GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
      '__PRERELEASE__': JSON.stringify(JSON.parse(process.env.PRERELEASE || 'true')),
    }),
    new ExtractTextPlugin('main.css')
  ]
}
