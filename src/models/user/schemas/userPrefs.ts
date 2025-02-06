import { Schema } from 'mongoose'
import type User from '../types/user'

const UserPrefsSchema = new Schema<User.Preferences>({
  theme: { type: String, enum: ['system', 'dark', 'light'], default: 'system' },
  lang: { type: String, default: 'en-US' }
})

export default UserPrefsSchema
