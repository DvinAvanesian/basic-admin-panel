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

  interface Interface {
    getProp<T>(_key: string, _options?: { errorIfNotFound?: true }): Promise<T>
    getProp<T>(key: string, options?: SessionManager.GetPropOptions): Promise<T | null>
    setProp(key: string, _value: string): Promise<void>
    getAuthStatus(_options?: { errorIfNotFound?: true }): Promise<AuthStatus>
    getAuthStatus(options?: SessionManager.GetPropOptions): Promise<AuthStatus | null>
    getCurrentUser(): Promise<User.Fields | void>
    setAuthLevel(level: AuthLevel): void
    expireAuth(): Promise<void>
    deleteProp(key: string): Promise<void>
    initSession(): Promise<void>
    loadUser(): Promise<void>
  }
}
