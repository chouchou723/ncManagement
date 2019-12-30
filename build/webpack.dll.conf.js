const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // vendor: ['vue/dist/vue.esm.js','vue-router','axios','iview','jquery/src/jquery']
    vendor: ['vue/dist/vue.common.js','vue-router', 'axios','element-ui','echarts','quill']  
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll3.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library',
      context: path.resolve(__dirname, '..'),
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
};
