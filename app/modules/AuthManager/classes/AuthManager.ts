import { jwtVerify, importSPKI, SignJWT, importPKCS8 } from 'jose'
import type AuthManager from '../types/AuthManager'
import path from 'path'
import { getSid } from '~/lib/util/sid'
import { SessionManager, Logger } from '~/modules'
import { User } from '~/models'
import { accessCookie, getAccess } from '../utils/accessCookie'
import { connectDB } from '~/lib'
import { createCookie } from '@remix-run/node'

class AuthManager {
  private alg = Bun.env.AUTH_ALGORITHM || 'RS256'
  private keys = {
    public: path.join(process.cwd(), Bun.env.AUTH_PUBLIC_KEY || 'keys/public.pem'),
    private: path.join(process.cwd(), Bun.env.AUTH_PRIVATE_KEY || 'keys/private.pem')
  }
  private req: Request

  constructor(req: Request) {
    this.req = req
  }

  async verify() {
    const token = await getAccess(this.req)
    if (!token) return

    try {
      // TODO: think of a better way
      const publicKeyFile = Bun.file(this.keys.public)
      const publicKey = await publicKeyFile.text()
      if (!publicKey) throw new Error()
      const key = await importSPKI(publicKey, this.alg)
      const { payload } = await jwtVerify(token, key)
      return payload as AuthManager.Payload
    } catch (e) {
      console.log('error', e)
      return
    }
  }

  private async create(userID: string, stayLoggedIn?: true) {
    try {
      const privateKeyFile = Bun.file(this.keys.private)
      const privateKey = await privateKeyFile.text()
      if (!privateKey) throw new Error()
      const key = await importPKCS8(privateKey, this.alg)
      const iat = Date.now()
      const exp = iat + 6048e5

      const token = await new SignJWT({ userID, iat, exp }).setProtectedHeader({ alg: this.alg }).sign(key)

      return accessCookie({ stayLoggedIn, exp }).serialize(token)
    } catch {
      throw new Error('Failed to create access token')
    }
  }

  async login(): Promise<Response> {
    const sid = await getSid(this.req)
    const XFW = this.req.headers.get('X-Forwarded-For')
    // fetch the headers
    const contentType = this.req.headers.get('Content-Type')
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
      data = await this.req.json()
      if (!('password' in data) || data.password === '') throw new Error()
    } catch (e) {
      logger.info({ message: `Rejected login request due to malformed request` })
      return new Response(undefined, { status: 400, statusText: 'Request Malformed' })
    }

    const { username, password, stayLoggedIn } = data

    // not providing username means the user was logged in and now is authenticating with a token
    if (!username) {
      const session = new SessionManager({ sid, XFW })
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
        const session = new SessionManager({ sid, XFW })

        // set the auth prop in the user's session
        await session.setProp('auth', { userID, client: XFW, level: 'priv' })
        await session.loadUser()

        // create a refresh token for the user
        const cookie = await this.create(document.userID, stayLoggedIn)

        // create a log group
        const group = crypto.randomUUID()

        // register the login action log
        await logger.action({
          message: `Successful login`,
          group,
          action: 'login',
          user: document._id
        })
        return new Response(undefined, { status: 200, statusText: 'Login Successful', headers: { 'Set-Cookie': cookie } })
      } else {
        logger.info({ message: `incorrect credentials` })
        return new Response(undefined, { status: 401, statusText: 'Incorrect Credentials' })
      }
    }

    logger.info({ message: 'Invalid username' })
    return new Response(undefined, { status: 404, statusText: 'Username Not Found' })
  }

  async logout(req: Request) {
    const sid = await getSid(this.req)
    const XFW = this.req.headers.get('X-Forwarded-For')
    // logout
    const session = new SessionManager({ sid, XFW })
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

    const access = createCookie('access', { expires: new Date() })

    // TODO: add return 405 if user not logged in

    return new Response(undefined, { status: 200, headers: { 'Set-Cookie': await access.serialize('') } })
  }
}

export { AuthManager }
