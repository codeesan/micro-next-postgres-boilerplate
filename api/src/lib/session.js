const path = require('path')

const fs = require('fs-extra')
const randomstring = require('randomstring')

// using a file-system/memory cache for speed. can upgrade to postgres if
// we want to persist sessions across server reboots/deploys, but
// will cost some speed

// pretty sure zeit stores their tokens in the database

class MemorySessions {
  constructor (tokenLength = 32) {
    this._tokenLength = tokenLength
    this._sessions = {}

    console.log('using memory sessions')
  }
  async create (session) {
    const secret = randomstring.generate(this._tokenLength)
    this._sessions[secret] = session
    return secret
  }

  async get (secret) {
    return this._sessions[secret]
  }

  async del (secret) {
    delete this._sessions[secret]
  }
}

class FSSessions {
  constructor (tokenLength = 32, cacheDir = './tmp/session-cache') {
    this._tokenLength = tokenLength
    this._cacheDir = cacheDir
    fs.mkdirs(this._cacheDir)

    console.log('using fs sessions')
  }

  async create (session) {
    const secret = randomstring.generate(this._tokenLength)
    fs.writeFileSync(path.join(this._cacheDir, `${secret}.json`), JSON.stringify(session))
    return secret
  }

  async get (secret) {
    // The python way :smirk:
    try {
      const contents = fs.readFileSync(path.join(this._cacheDir, `${secret}.json`))

      return JSON.parse(contents)
    } catch (err) {}
  }

  async del (secret) {
    fs.unlinkSync(path.join(this._cacheDir, `${secret}.json`))
  }
}

// use memory in production, and fs in development
// hot reload cause memory cache to be wiped, so need fs in development
// 'now' doesn't allow writing to file system, so use memory in production

module.exports = process.env.NODE_ENV === 'production'
  ? new MemorySessions()
  : new FSSessions()
