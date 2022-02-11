const webpack = require('webpack');
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname,'app')
const dirShared = path.join(__dirname,'shared')
const dirStyles = path.join(__dirname,'styles')
const dirNode = 'node_modules'
console.log(dirApp,dirShared,dirStyles)

module.exports = {
    entry:[
        path.join(dirApp,'index.js'),
        path.join(dirStyles,'index.scss')
    ],
    resolve:{
        modules:[
            dirApp,
            dirStyles,
            dirShared,
            dirNode
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from:'./shared',
                    to: ''
                }
            ]
        }),
    ]
}