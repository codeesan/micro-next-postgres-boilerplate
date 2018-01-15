const assert = require('assert')

const micro = require('micro')
const listen = require('test-listen')
const fetch = require('node-fetch')
const {merge} = require('lodash')
const bcrypt = require('bcrypt')
const cookie = require('cookie')

const services = require('./src/lib/services')

module.exports.microFetch = async function microFetch (microFn, path = '/', options = {}) {
  const service = micro(microFn)
  const url = await listen(service)

  let _body = options.body
  if (typeof _body === 'object') {
    _body = JSON.stringify(_body)
  }
  delete options.body

  const _options = merge({
    headers: {
      'content-type': 'application/json'
    },
    body: _body
  }, options)

  const res = await fetch(`${url}${path}`, _options)

  res.text = await res.text()

  try {
    res.json = JSON.parse(res.text)
  } catch (err) {}

  res.cookie = cookie.parse(res.headers.get('set-cookie') || '')

  service.close()

  return res
}

module.exports.deleteUser = async function deleteUser (user) {
  assert(user.email, 'deleteUser(user) needs user.email')

  await services.pg.query(
    `
      delete from users where email = $1
    `, [user.email]
  )
}

const PASSWORD_BCRYPT_SALT_ROUNDS = 10

const USER_DEFAULTS = {
  email: 'l4nc3rr@gmail.com',
  password: 'password',
  name: 'Tucker Connelly'
}

module.exports.withUser = async function withUser (user) {
  const _user = merge(USER_DEFAULTS, user)

  _user.password = await bcrypt.hash(_user.password, PASSWORD_BCRYPT_SALT_ROUNDS)

  const res = await services.pg.query(
    `
      insert into users (email, password, name)
      values ($1, $2, $3)
      on conflict(email) do update
      set password = excluded.password, name = excluded.name
      returning *
    `, [_user.email, _user.password, _user.name]
  )

  return res.rows[0]
}
