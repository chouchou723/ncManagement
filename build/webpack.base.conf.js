'use strict'
const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
// const vueLoaderConfig = require('./vue-loader.conf')
const babel = require('babel-polyfill')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json','.ts'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '@': resolve('src'),
      '~components': resolve('src/components/'),
      'assets': resolve('src/assets/'),
      '~assets': resolve('src/assets/'),
      'common':resolve('src/common/'),
      '~cloud':resolve('src/components/cloud'),
      '~system':resolve('src/components/system'),
      '~user':resolve('src/components/user'),
      'static':resolve('static/'),
      'api':resolve('src/api/'),
      'utils':resolve('src/utils/'),
      'filter':resolve('src/filter/'),
      'jquery': path.resolve(__dirname, '../node_modules/jquery/src/jquery'),
      'directives': path.resolve(__dirname, '../src/directives')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            // options: vueLoaderConfig
          },
        //   {
        //     loader: 'iview-loader',
        //     options: {
        //         prefix: false
        //     }
        //   }
        ]
      },
      // {
      //   test: require.resolve("jquery"),
      //   loader: "imports-loader?this=>window"
      // },
    //   {
    //     test:/\.css$/,
    //     loader:'style-loader!css-loader',
    //     include:[
    //       '/src/',
    //     //   '/node_modules/element-ui/lib/'
    //     ]
    //   },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'),resolve('node_modules/vue-echarts-v3/src')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      $:"jquery",
      jQuery:"jquery",
      "window.jquery":"jquery"
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '..'),
      manifest: require('./vendor-manifest.json')
    })
  ]
}



