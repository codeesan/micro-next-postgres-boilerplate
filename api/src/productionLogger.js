const {json} = require('micro')

module.exports = function productionLoggerHOF (microFn) {
  return async function productionLogger (req, res, ...args) {
    if (req.headers['content-type'] === 'application/json') {
      req._logBody = await json(req)
    }

    res.once('finish', () => {
      console.log(JSON.stringify({
        req: {
          url: req.url,
          method: req.method,
          headers: req.headers,
          body: req._logBody
        },
        res: {
          body: res._logBody,
          headers: res.getHeaders(),
          statusCode: res.statusCode
        },
        time: `${new Date() - start}ms`
      }))
    })

    const start = new Date()
    const ret = await microFn(req, res, ...args)

    res._logBody = ret
    return res._logBody
  }
}
