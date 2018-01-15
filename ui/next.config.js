require('dotenv').config()

const webpack = require('webpack')
const {pick} = require('lodash')

module.exports = {
  webpack: (config, {dev}) => {
    config.node = {net: 'empty', dns: 'empty'}
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(
          pick(process.env, 'MY_APP_API_URL')
        )
      })
    )
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'UglifyJsPlugin'
    )
    return config
  }
}
