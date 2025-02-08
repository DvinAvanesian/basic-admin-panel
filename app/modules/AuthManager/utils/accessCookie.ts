import { createCookie } from '@remix-run/node'

export const accessCookie: AccessCookieCreator = opts =>
  createCookie('access', {
    expires: opts?.stayLoggedIn ? new Date(opts.exp) : undefined,
    httpOnly: true,
    sameSite: 'strict'
  })

export const getAccess = async (req: Request) => {
  return await accessCookie().parse(req.headers.get('Cookie'))
}
