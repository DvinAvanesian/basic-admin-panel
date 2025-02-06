import { JWTPayload } from 'jose'

namespace AuthManager {
  export interface Credentials {
    username: string | undefined
    password: string | undefined
  }

  export interface Payload extends JWTPayload {
    userID: string
  }
}

export default AuthManager
