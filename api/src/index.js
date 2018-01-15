require('dotenv').config()

const {send} = require('micro')
const compose = require('micro-compose')
const cors = require('micro-cors')
const compress = require('micro-compress')
const {pickBy, startsWith} = require('lodash')

const accountForMountPath = require('./accountForMountPath')
const productionLogger = require('./productionLogger')
const authenticate = require('./authenticate')
const authorize = require('./authorize')
const proxyToPostgres = require('./proxyToPostgrest')

module.exports =
  compose(
    accountForMountPath,
    process.env.NODE_ENV === 'production' && productionLogger,
    cors({
      origin: process.env.NODE_ENV === 'production'
        ? '*'
        : 'http://localhost:3000',
      // Extra headers needed for postgrest
      allowHeaders: ['X-Requested-With', 'Access-Control-Allow-Origin', 'X-HTTP-Method-Override', 'Content-Type', 'Authorization', 'Accept', 'Range', 'Range-Unit', 'Prefer']
    }),
    authenticate,
    authorize,
    proxyToPostgres,
    compress
  )(async (req, res) => send(res, 404))

if (process.env.NODE_ENV !== 'test') {
  process.on('unhandledRejection', err => console.error(err))
}

if (process.env.NODE_ENV === 'production') {
  console.log('Starting with env', pickBy(process.env, (value, key) => !startsWith(key, 'npm_')))
}
