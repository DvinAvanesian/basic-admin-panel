'use server'

import { jwtVerify, importSPKI, SignJWT, importPKCS8 } from 'jose'
import { cookies } from 'next/headers'
import type AuthManager from '../types/AuthManager'
import path from 'path'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

class AuthManager {
  private alg = Bun.env.AUTH_ALGORITHM || 'RS256'
  private keys = {
    public: path.join(process.cwd(), Bun.env.AUTH_PUBLIC_KEY || 'keys/public.pem'),
    private: path.join(process.cwd(), Bun.env.AUTH_PRIVATE_KEY || 'keys/private.pem')
  }
  private store!: ReadonlyRequestCookies

  async verify() {
    if (!this.store) this.store = await cookies()
    const token = this.store.get('access')?.value
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

  async create(userID: string, stayLoggedIn?: true) {
    if (!this.store) this.store = await cookies()
    try {
      const privateKeyFile = Bun.file(this.keys.private)
      const privateKey = await privateKeyFile.text()
      if (!privateKey) throw new Error()
      const key = await importPKCS8(privateKey, this.alg)
      const iat = Date.now()
      const exp = iat + 6048e5

      const token = await new SignJWT({ userID, iat, exp }).setProtectedHeader({ alg: this.alg }).sign(key)

      this.store.set({
        name: 'access',
        value: token,
        expires: stayLoggedIn ? exp : undefined,
        httpOnly: true,
        sameSite: 'strict'
      })
    } catch {
      throw new Error('Failed to create access token')
    }
  }
}

export { AuthManager }
