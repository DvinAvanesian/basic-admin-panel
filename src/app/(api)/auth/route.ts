'use server'

import { connectDB } from '@/lib/mongoose'
import { User } from '@/models'
import { NextRequest, NextResponse } from 'next/server'
import { AuthManager, SessionManager, Logger } from '@/modules'

export const POST = async (req: NextRequest): Promise<Response> => {
  // fetch the headers
  const contentType = req.headers.get('Content-Type')
  const XFW = req.headers.get('X-Forwarded-For')
  //configure the logger
  const logger = new Logger({ client: XFW, url: '/auth', method: 'POST' })

  // check the content type
  if (contentType !== 'application/json') {
    logger.info({ message: `Rejected login request with Content-Type: "${contentType}"` })
    return new Response(undefined, { status: 415, statusText: 'Invalid Content Type' })
  }

  let data

  // fetch the request body
  try {
    data = await req.json()
    if (!('password' in data) || data.password === '') throw new Error()
  } catch (e) {
    logger.info({ message: `Rejected login request due to malformed request` })
    return new Response(undefined, { status: 400, statusText: 'Request Malformed' })
  }

  const { username, password, stayLoggedIn } = data

  // not providing username means the user was logged in and now is authenticating with a token
  if (!username) {
    const session = new SessionManager()
    const authStatus = await session.getAuthStatus()

    // return 400 if the user's token was invalid
    if (!authStatus)
      return new Response(undefined, {
        status: 400,
        statusText: 'Request Malformed'
      })

    // fetch the user from session object (since it's already fetched from the db and cached)
    const user = await session.getProp<User.Document>('user')

    // throw error if the user wasn't found (rare)
    if (!user) throw new Error()

    const { password: userPassword, username, _id } = user

    // check if the password is correct
    const passwordCorrect = await Bun.password.verify(password, userPassword)

    // update the logger with the user's credentials
    logger.update({ client: XFW, url: '/auth', method: 'POST', user: username })

    if (passwordCorrect) {
      // authorize the user if correct password provided
      await session.setAuthLevel('priv')

      // create a log group
      const group = crypto.randomUUID()

      // register the action log
      logger.action({
        message: `Successful authentication`,
        group,
        action: 'authentication',
        user: _id as string
      })

      return new Response(undefined, { status: 200, statusText: 'Authentication Successful' })
    } else {
      logger.info({ message: `Incorrect password` })
      return new Response(undefined, { status: 401, statusText: 'Incorrect Password' })
    }
  }

  // make sure the database connection is established
  await connectDB()

  // get the user
  const document = await User.findOne({ username })

  // process if the provided username is found
  if (document) {
    const { userID } = document

    // verify the provided password if the user was valid
    const passwordCorrect = await Bun.password.verify(password, document.password)

    // update the logger with the user's credentials
    logger.update({ client: XFW, url: '/auth', method: 'POST', user: document.username })

    if (passwordCorrect) {
      // authorize the user if correct credentials are provided
      const session = new SessionManager()
      const authManager = new AuthManager()

      // set the auth prop in the user's session
      await session.setProp('auth', { userID, client: XFW, level: 'priv' })
      await session.loadUser()

      // create a refresh token for the user
      await authManager.create(document.userID, stayLoggedIn)

      // create a log group
      const group = crypto.randomUUID()

      // register the login action log
      await logger.action({
        message: `Successful login`,
        group,
        action: 'login',
        user: document._id
      })
      return new Response(undefined, { status: 200, statusText: 'Login Successful' })
    } else {
      logger.info({ message: `incorrect credentials` })
      return new Response(undefined, { status: 401, statusText: 'Incorrect Credentials' })
    }
  }

  logger.info({ message: 'Invalid username' })
  return new Response(undefined, { status: 404, statusText: 'Username Not Found' })
}

export const DELETE = async (req: Request) => {
  // logout
  const session = new SessionManager()
  const authStatus = await session.getAuthStatus()

  // revoke the auth data if the user has logged in
  if (authStatus) {
    const XFW = req.headers.get('X-Forwarded-For')
    const user = await session.getCurrentUser()
    const username = user ? user.username : undefined
    const logger = new Logger({ client: XFW, url: '/auth', method: 'DELETE', user: username })
    await session.expireAuth()
    logger.info({ message: `Logout successful` })
  }

  // TODO: add return 405 if user not logged in

  const res = new NextResponse()
  res.cookies.delete('access')
  return res
}
