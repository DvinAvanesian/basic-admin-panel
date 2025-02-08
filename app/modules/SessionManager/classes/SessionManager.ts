import redis from '~/lib/redis'
import { Logger, AuthManager } from '~/modules'
import { User } from '~/models'
import { connectDB } from '~/lib/mongoose'
import type { SessionManager } from '../types/SessionManager'

// SessionManager class for handling sessions, stored in redis
class SessionManager implements SessionManager.Interface {
  private skey!: string // session key for redis
  private XFW: string | null // ip address of the client
  private logger!: Logger // a Logger instance for logging

  // ? what if we provide logger instance to the object if we already have one in the context we're using the SessionManager for optimization purposes?

  constructor({ sid, XFW }: SessionManager.Options) {
    this.getSessionKey(sid)
    this.XFW = XFW
  }

  // gets the sid from the request cookies and sets the redis key for the session
  private getSessionKey(sid: string) {
    try {
      if (!sid) {
        // because sid must be set and the middleware handles it
        throw new Error('sid cookie not set')
      }

      this.skey = `basic-admin-panel:session:${sid}`
    } catch (err: any) {
      this.logger.error({ message: `Failed to get session key: ${err.message}` })
      throw err
    }
  }

  // initialize the logger instance
  private async initializeLogger(): Promise<void> {
    if (this.logger) return
    try {
      // initialize the logger with the client's ip
      this.logger = new Logger({ client: this.XFW })
    } catch (err: any) {
      console.error('Failed to initialize logger:', err)
      throw new Error('Logger initialization failed')
    }
  }

  // initialize the session
  async initSession(req: Request): Promise<void> {
    await this.initializeLogger()

    try {
      // make sure the redis client is connected
      if (!redis.isOpen) await redis.connect()

      // get the session the session to see if it exists
      // ? any better way?
      const session = await redis.json.get(this.skey)

      if (!session) {
        // create the session in redis if not set
        await redis.json.set(this.skey, '$', {
          createdAt: Date.now(),
          lastAccessed: Date.now()
        })
      } else {
        // set/reset a 10 minute expire time each time the session is accessed
        await Promise.all([redis.expire(this.skey, 600), redis.json.set(this.skey, '$.lastAccessed', Date.now())])
      }

      // now cache the user data
      await this.loadUser(req)
    } catch (err: any) {
      this.logger.error({ message: `Session initialization failed: ${err.message}` })
      throw err
    }
  }

  // load the user from the db and put it in the session as cache
  // ? dumb idea?
  // ! might be removed
  private async loadUser(req: Request): Promise<void> {
    await this.initializeLogger()
    try {
      // first check if it's already set or not
      const user = await this.getProp<User.Fields>('user')
      // nothing to be done if already set
      if (user) return

      // make sure bla bla
      await connectDB()
      // get the authentication status to see if the user is logged in or not
      const auth = await this.getAuthStatus(req)

      if (!auth) {
        // ? point of this log message?
        this.logger.info({ message: 'No auth status found during user load' })
        return
      }

      // get the userID if logged in
      const { userID } = auth
      // get the user's document from the db
      const doc = await User.findOne({ userID }, '-__v -userID').populate('parent', '-__v').lean()

      if (!doc) {
        // impossible to happen
        this.logger.error({ message: `User not found for ID: ${userID}` })
        throw new Error()
      }

      // now set the user prop in the session data
      await this.setProp('user', doc)
    } catch (err: any) {
      this.logger.error({ message: `User load failed: ${err.message}` })
      throw err
    }
  }

  // get a property from the session
  // using generic for type checking the returned data
  async getProp<T>(_key: string, _options?: { errorIfNotFound?: true }): Promise<T>
  async getProp<T>(key: string, options?: SessionManager.GetPropOptions): Promise<T | null> {
    await this.initializeLogger()
    try {
      // make sure the redis client is connected
      if (!redis.isOpen) await redis.connect()

      // format the path to be able to access the requested path in the session object
      const path = `$.${key}`

      // get the thing
      const val = (await redis.json.get(this.skey, { path })) as T[]

      // return null if the requested prop doesn't exist
      if (!val) {
        if (options?.errorIfNotFound) throw new Error(`Property ${key} not found`)
        return null
      }

      return val[0]
    } catch (err: any) {
      this.logger.error({ message: `Failed to get property ${key}: ${err.message}` })
      throw new Error()
    }
  }

  // set props
  async setProp(key: string, value: any): Promise<void> {
    await this.initializeLogger()
    try {
      // set the prop (no shit)
      await redis.json.set(this.skey, `$.${key}`, value)
    } catch (err: any) {
      this.logger.error({ message: `Failed to set property ${key}: ${err.message}` })
      throw err
    }
  }

  // delete a prop (no shit again)
  async deleteProp(key: string): Promise<void> {
    await this.initializeLogger()

    try {
      // delete the prop (!!!)
      await redis.json.del(this.skey, `$.${key}`)
    } catch (err: any) {
      this.logger.error({ message: `Failed to delete property ${key}: ${err.message}` })
      throw err
    }
  }

  // set the user authentication level, used when a user need write permission
  async setAuthLevel(req: Request, level: 'priv' | 'access'): Promise<void> {
    await this.initializeLogger()
    try {
      const auth = await this.getAuthStatus(req)
      // ...auth so the userID stays there as it is
      const newObj = {
        ...auth,
        level,
        // user's ip is also set when authenticated
        client: level === 'priv' ? this.XFW : undefined,
        updatedAt: Date.now()
      }
      await this.setProp('auth', newObj)
    } catch (err: any) {
      this.logger.error({ message: `Failed to set auth level: ${err.message}` })
      throw err
    }
  }

  // get the user's authentication status, returns null if the user hasn't logged in
  async getAuthStatus(req: Request, _options?: { errorIfNotFound?: true }): Promise<SessionManager.AuthStatus>
  async getAuthStatus(req: Request, options?: SessionManager.GetPropOptions): Promise<SessionManager.AuthStatus | null> {
    await this.initializeLogger()
    try {
      const auth = await this.getProp<SessionManager.AuthStatus>('auth')

      if (auth) {
        // just return the auth status if authorized
        if (auth.level === 'priv' && this.XFW !== auth.client) {
          // deauthorize user from writing if the user's ip changes
          await this.setAuthLevel(req, 'access')
          // refetch the auth prop after deauthorizing
          const auth = await this.getProp<SessionManager.AuthStatus>('auth')
          return auth
        }

        return auth
      }

      // if auth prop doesn't exist in the session, create it if the user had logged in in previous sessions
      const authManager = new AuthManager(req)
      const access = await authManager.verify()
      // return null if the user doesn't have access token
      if (!access) return null

      if (options?.errorIfNotFound) throw new Error()

      // get the userID from the JWT payload
      const { userID } = access
      // create the auth prop
      await this.setProp('auth', {
        userID,
        level: 'access'
      })

      return { userID, level: 'access' }
    } catch (err: any) {
      this.logger.error({ message: `Failed to get auth status: ${err.message}` })
      return null
    }
  }

  // handy method to get the current user's info
  async getCurrentUser(req: Request): Promise<User.Fields<true>> {
    await this.initializeLogger()
    try {
      // make sure the usezr is loaded
      // ? is this needed?
      await this.loadUser(req)
      const user = await this.getProp<User.Fields<true>>('user')
      if (!user) throw new Error()
      return user
    } catch (err: any) {
      this.logger.error({ message: `Failed to get current user: ${err.message}` })
      throw new Error()
    }
  }

  // expire the authentication data and user data, used for log out
  async expireAuth(): Promise<void> {
    await this.initializeLogger()
    try {
      await Promise.all([this.deleteProp('auth'), this.deleteProp('user')])
    } catch (err: any) {
      this.logger.error({ message: `Failed to expire auth: ${err.message}` })
      throw err
    }
  }
}

export { SessionManager }
