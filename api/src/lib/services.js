// Postgres

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.MY_APP_PG_URL || '',
  ssl: process.env.MY_APP_PG_SERVER_CA_BASE64
    ? {
      rejectUnauthorized: false,
      ca: Buffer.from(process.env.MY_APP_PG_SERVER_CA_BASE64, 'base64'),
      key: Buffer.from(process.env.MY_APP_PG_CLIENT_KEY_BASE64, 'base64'),
      cert: Buffer.from(process.env.MY_APP_PG_CLIENT_CERT_BASE64, 'base64')
    }
    : undefined
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports.pg = pool
