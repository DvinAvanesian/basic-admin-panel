export namespace SessionManager {
  type AuthLevel = 'priv' | 'access'

  interface AuthStatus {
    level: AuthLevel
    userID?: string
    client?: string
  }

  interface GetPropOptions {
    errorIfNotFound?: boolean
  }

  interface Options {
    sid: string
    XFW: string | null
  }

  interface Interface {
    getProp<T>(_key: string, _options?: { errorIfNotFound?: true }): Promise<T>
    getProp<T>(key: string, options?: SessionManager.GetPropOptions): Promise<T | null>
    setProp(key: string, _value: string): Promise<void>
    getAuthStatus(req: Request, _options?: { errorIfNotFound?: true }): Promise<AuthStatus>
    getAuthStatus(req: Request, options?: SessionManager.GetPropOptions): Promise<AuthStatus | null>
    getCurrentUser(req: Request): Promise<User.Fields | void>
    setAuthLevel(req: Request, level: AuthLevel): void
    expireAuth(): Promise<void>
    deleteProp(key: string): Promise<void>
    initSession(req: Request): Promise<void>
    //loadUser(req: Request): Promise<void>
  }
}
