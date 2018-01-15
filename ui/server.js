const micro = require('micro')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

process.on('unhandledRejection', err => console.error(err))

app.prepare().then(() => {
  micro(
    async (req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const {pathname} = parsedUrl

      if (
        /^\/_next/.test(pathname) ||
        /^\/static/.test(pathname)
      ) {
        return handle(req, res, parsedUrl)
      } else {
        handle(req, res, parsedUrl)
      }
    }
  ).listen(process.env.MY_APP_UI_PORT, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.MY_APP_UI_PORT}`)
  })
})
