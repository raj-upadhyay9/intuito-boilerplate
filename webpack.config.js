const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirImage = path.join(__dirname, 'images')
const dirVideos = path.join(__dirname, 'videos')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'
console.log(dirApp, dirShared, dirStyles, dirImage, dirVideos)

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            // Your options for `squoosh`
          }
        }
      })
    ]
  },

  resolve: {
    modules: [dirApp, dirStyles, dirImage, dirVideos, dirShared, dirNode]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },

          {
            loader: 'postcss-loader'
          },

          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /^.+\.(jpg|jpeg|png|gif|bmp|svg|webp)$/,
        type: 'asset',
        loader: 'file-loader',
        options: {
          name (file) {
            return '[hash].[ext]'
          }
        }
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
