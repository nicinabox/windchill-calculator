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
      'FORECAST_API_KEY': JSON.stringify(process.env.FORECAST_API_KEY),
      'GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
      '__PRERELEASE__': JSON.stringify(JSON.parse(process.env.PRERELEASE || 'true')),
    })
  ]
}
