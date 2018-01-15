require('dotenv').config()

const {exec} = require('child_process')
const {parse} = require('url')

const fetch = require('node-fetch')
const {json} = require('micro')
const bcrypt = require('bcrypt')
// const request = require('request')

const PASSWORD_BCRYPT_SALT_ROUNDS = 10

module.exports = function proxyToPostgresHOF (microFn) {
  return async function proxyToPostgres (req, res, ...args) {
    const {href} = parse(req.url, true)

    console.log(`Piping to http://localhost:${process.env.MY_APP_API_PGRST_PORT}${href}`)

    let js

    try {
      // Get in here to modify requests to postgres
      js = await json(req)

      if (js.password && js.password.length) {
        js.password = await bcrypt.hash(js.password, PASSWORD_BCRYPT_SALT_ROUNDS)
      } else {
        delete js.password
      }
    } catch (err) {}

    const _reqHeaders = req.headers
    delete _reqHeaders['content-length']

    const postgrestRes = await fetch(`http://localhost:${process.env.MY_APP_API_PGRST_PORT}${href}`, {
      method: req.method,
      headers: _reqHeaders,
      body: js && JSON.stringify(js)
    })

    const _resHeaders = postgrestRes.headers.raw()

    Object.keys(_resHeaders).forEach(headerName => {
      if (['content-encoding'].includes(headerName)) return
      res.setHeader(headerName, _resHeaders[headerName])
    })

    res.statusCode = postgrestRes.status
    res.statusMessage = postgrestRes.statusText

    const resText = await postgrestRes.text()

    return resText

    // Below is code for directly streaming req to postgrest

    // const postgrestReq = request(
    //   `http://localhost:${process.env.MY_APP_API_PGRST_PORT}${href}`
    // )
    // req.pipe(postgrestReq)
    // postgrestReq.pipe(res)
  }
}

exec('pkill postgrest', () => {
  const postgrestProcess = exec(`SVC_RESTAPI_PGRST_SERVER_PORT=${process.env.MY_APP_API_PGRST_PORT} MY_APP_PG_URL=${process.env.MY_APP_PG_URL} postgrest postgrest.conf`)
  postgrestProcess.stdout.pipe(process.stdout)
  postgrestProcess.stderr.pipe(process.stderr)
})
