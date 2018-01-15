const {parse} = require('url')

const {send} = require('micro')

function _anyRegexPasses (regexes, value) {
  return regexes.reduce((passed, currentRegex) => {
    if (passed) return true
    return currentRegex.test(value)
  }, false)
}

function _can (user = {}, methodAndPath) {
  if (user.is_admin) return true

  if (_anyRegexPasses([
    /^GET \/users/,
    /^POST \/signup\/?$/,
    /^POST \/login\/?$/,
    /^POST \/me\/?$/,
    /^POST \/logout\/?$/
  ], methodAndPath)) return true

  return false
}

module.exports = function authorizeHOF (microFn) {
  return function authorize (req, res, ...args) {
    const {href} = parse(req.url, true)

    if (!_can(req.session, `${req.method} ${href}`)) {
      return send(res, 401)
    }

    return microFn(req, res, ...args)
  }
}
