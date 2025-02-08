import { createCookie } from '@remix-run/node'

export const sidCookie = createCookie('sid', {
  httpOnly: true
})

export const getSid = async (req: Request) => {
  return await sidCookie.parse(req.headers.get('Cookie'))
}
