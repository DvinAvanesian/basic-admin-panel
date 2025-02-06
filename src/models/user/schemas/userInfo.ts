import { Schema } from 'mongoose'
import type User from '../types/user'

const UserInfoSchema = new Schema<User.Info>({
  name: {
    type: Schema.Types.Mixed
  },
  surname: {
    type: Schema.Types.Mixed
  },
  contactPhone: {
    type: {
      countryCode: { type: String },
      number: { type: String }
    },
    required: false
  },
  email: { type: String, required: false }
})

export default UserInfoSchema
