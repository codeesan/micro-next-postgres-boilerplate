const {parse} = require('url')

const cookie = require('cookie')
const {json, send} = require('micro')
const bcrypt = require('bcrypt')
const {trim} = require('lodash')
const validator = require('validator')

const session = require('./lib/session')
const services = require('./lib/services')

const PASSWORD_BCRYPT_SALT_ROUNDS = 10

module.exports = function handleAuthHOF (microFn = () => 0) {
  return async function handleAuth (req, res, ...args) {
    const reqCookie = cookie.parse(req.headers.cookie || '')

    if (reqCookie.token) {
      req.session = await session.get(reqCookie.token)
    }

    // Need to use a header other than cookie, 'cause browser won't send cookie
    // sometimes in CORS
    //
    // Postgrest thinks "Bearer " is a jwt, and throws an error, so using
    // nonstandard "Token "
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Token ', '')
      req.session = await session.get(token)
    }

    const {href} = parse(req.url, true)

    if (req.method === 'POST' && /\/signup\/?/.test(href)) {
      if (!req.headers['content-type'].includes('application/json')) {
        return send(res, 400, {general: `content-type: application/json required, you sent content-type: ${req.headers['content-type']}`})
      }

      const js = await json(req)

      js.name = js.name && trim(js.name)
      js.email = js.email && trim(js.email)

      if (!js.name || !js.name.length) {
        return send(res, 400, {name: 'Name is required'})
      }

      if (!js.email || !js.email.length) {
        return send(res, 400, {email: 'Email is required'})
      }

      if (!js.password || !js.password.length) {
        return send(res, 400, {password: 'Password is required'})
      }

      if (!js.confirm_password || !js.confirm_password.length) {
        return send(res, 400, {confirm_password: 'Password confirmation is required'})
      }

      if (js.password !== js.confirm_password) {
        return send(res, 400, {confirm_password: 'Passwords don\'t match'})
      }

      if (!validator.isEmail(js.email)) {
        return send(res, 400, {email: 'Enter a valid email'})
      }

      const existingEmailRes = await services.pg.query(
        `
          select id from users where email = $1
        `, [js.email]
      )

      if (existingEmailRes.rows.length > 0) {
        return send(res, 400, {email: 'That email is already taken'})
      }

      const encryptedPassword = await bcrypt.hash(js.password, PASSWORD_BCRYPT_SALT_ROUNDS)

      const insertRes = await services.pg.query(
        `
          insert into users (email, name, password)
          values ($1, $2, $3)
          returning *
        `, [js.email, js.name, encryptedPassword]
      )

      const token = await session.create(insertRes.rows[0])
      res.setHeader('Set-Cookie', [`token=${token}`])

      return send(res, 200, 'OK')
    }

    if (req.method === 'POST' && /\/login\/?/.test(href)) {
      if (!req.headers['content-type'].includes('application/json')) {
        return send(res, 400, {general: `content-type: application/json required, you sent content-type: ${req.headers['content-type']}`})
      }

      const js = await json(req)

      if (!js.email || !js.email.length) {
        return send(res, 400, {email: 'Email required'})
      }

      if (!js.password || !js.password.length) {
        return send(res, 400, {password: 'Password required'})
      }

      const userRes = await services.pg.query(
        `
          select *
          from users
          where email = $1
        `, [js.email]
      )

      if (!userRes.rows.length) {
        return send(res, 400, {email: 'No user found with that email'})
      }

      if (!await bcrypt.compare(js.password, userRes.rows[0].password)) {
        return send(res, 400, {password: 'Wrong email or password'})
      }

      const token = await session.create(userRes.rows[0])
      res.setHeader('Set-Cookie', [`token=${token}`])

      return send(res, 200, 'OK')
    }

    if (/\/me\/?/.test(href)) {
      if (!reqCookie.token) return send(res, 401)

      const userSession = await session.get(reqCookie.token)

      if (!userSession) return send(res, 401)

      const userRes = await services.pg.query(
        `
          select * from users where id = $1
        `, [userSession.id]
      )

      if (!userRes.rows.length) {
        console.error('User id from session not found in db', userSession)
        return send(res, 401)
      }

      return userRes.rows[0]
    }

    if (/\/logout\/?/.test(href)) {
      await session.del(reqCookie.token)

      return send(res, 200)
    }

    return microFn(req, res, ...args)
  }
}
