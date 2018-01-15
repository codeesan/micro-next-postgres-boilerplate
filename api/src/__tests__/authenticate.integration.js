const {microFetch, withUser, deleteUser} = require('../../testUtils')
const services = require('../lib/services')
const authenticate = require('../authenticate')

describe('/signup', () => {
  it('errors if name not present', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {}
    })

    expect(res.status).toBe(400)
    expect(res.json.name).toBeTruthy()
  })

  it('errors if email not present', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.email).toBeTruthy()
  })
  it('errors if password not present', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email: 'my@email.com'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.password).toBeTruthy()
  })
  it('errors if confirm_password not present', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email: 'my@email.com',
        password: 'asdlfkjsdlfkjsdlfkj'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.confirm_password).toBeTruthy()
  })

  it('errors if password doesn\'t match confirm_password', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email: 'test@test.com',
        password: 'asdlfkjsdlfkjsdlfkj',
        confirm_password: 'fdsafdsa'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.confirm_password).toBeTruthy()
  })

  it('errors if email is invalid', async () => {
    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email: 'notavalidemail',
        password: 'asdlfkjsdlfkjsdlfkj',
        confirm_password: 'asdlfkjsdlfkjsdlfkj'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.email).toBeTruthy()
  })
  it('errors if email is already taken', async () => {
    const email = 'test_signup_email_taken@test.com'
    await withUser({email})

    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email,
        password: 'asdlfkjsdlfkjsdlfkj',
        confirm_password: 'asdlfkjsdlfkjsdlfkj'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.email).toBeTruthy()
  })

  it('makes a user if everything checks out', async () => {
    const email = 'test_signup@test.com'
    await deleteUser({email})

    const res = await microFetch(authenticate(), '/signup', {
      method: 'POST',
      body: {
        name: 'My Name',
        email,
        password: 'asdlfkjsdlfkjsdlfkj',
        confirm_password: 'asdlfkjsdlfkjsdlfkj'
      }
    })

    expect(res.status).toBe(200)
    expect(res.cookie.token).toBeTruthy()

    const userRes = await services.pg.query(
      `
        select id from users where email = $1
      `, [email]
    )

    expect(userRes.rows.length).toBe(1)
  })
})

describe('/login', () => {
  it('returns 400 if no email passed', async () => {
    const res = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {}
    })

    expect(res.status).toBe(400)
    expect(res.json.email).toBeTruthy()
  })

  it('returns 400 if no password passed', async () => {
    const res = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {
        email: 'test@test.com'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.password).toBeTruthy()
  })

  it('returns 400 if user not found', async () => {
    const res = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {
        email: 'test@test.com',
        password: 'testestest'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.email).toBeTruthy()
  })

  it('returns 400 if password not correct', async () => {
    await withUser({
      email: 'l4nc3rr@gmail.com',
      password: 'password'
    })

    const res = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {
        email: 'l4nc3rr@gmail.com',
        password: 'notpassword'
      }
    })

    expect(res.status).toBe(400)
    expect(res.json.password).toBeTruthy()
  })

  it('returns 200 with token cookie if everything checks out', async () => {
    await withUser({
      email: 'l4nc3rr@gmail.com',
      password: 'password'
    })

    const res = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {
        email: 'l4nc3rr@gmail.com',
        password: 'password'
      }
    })

    expect(res.status).toBe(200)
    expect(res.cookie.token).toBeTruthy()
  })
})

describe('/me', () => {
  it('errors if not logged in', async () => {
    const res = await microFetch(authenticate(), '/me', {
      method: 'POST',
      body: {
        email: 'l4nc3rr@gmail.com',
        password: 'password'
      }
    })

    expect(res.status).toBe(401)
  })

  it('returns user if logged in', async () => {
    await withUser({
      email: 'l4nc3rr@gmail.com',
      password: 'password'
    })

    const loginRes = await microFetch(authenticate(), '/login', {
      method: 'POST',
      body: {
        email: 'l4nc3rr@gmail.com',
        password: 'password'
      }
    })

    expect(loginRes.status).toBe(200)
    expect(loginRes.cookie.token).toBeTruthy()

    const res = await microFetch(authenticate(), '/me', {
      method: 'POST',
      headers: {
        cookie: `token=${loginRes.cookie.token}`
      }
    })

    expect(res.status).toBe(200)
    expect(res.json.email).toBe('l4nc3rr@gmail.com')
  })
})
