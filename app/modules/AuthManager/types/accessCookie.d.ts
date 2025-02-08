interface AccessCookieCreatorOptions {
  stayLoggedIn: boolean | undefined
  exp: number
}

type AccessCookieCreator = (opts?: AccessCookieCreatorOptions) => Cookie
