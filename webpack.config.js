var webpack = require('webpack')

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
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'FORECAST_API_KEY': JSON.stringify(process.env.FORECAST_API_KEY),
      }
    })
  ]
}
