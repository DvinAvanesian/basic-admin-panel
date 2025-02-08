import mongoose, { Schema } from 'mongoose'
import UserInfoSchema from './userInfo'
import UserPrefsSchema from './userPrefs'
import genID from '~/lib/util/genID'
import type User from '../types/user'

const UserSchema = new Schema<User.Document>({
  userID: { type: String, default: () => genID(6) },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true, unique: true },
  parent: { type: Schema.Types.ObjectId, required: true, ref: 'Client' },
  password: { type: String, required: true },
  userInfo: { type: UserInfoSchema, required: true, _id: false },
  userPrefs: { type: UserPrefsSchema, _id: false },
  permissions: [
    {
      type: String,
      _id: false,
      enum: [
        'any',
        'currentClientWrite',
        'analyticsAccess',
        'productsAccess',
        'productsWrite',
        'usersAccess',
        'usersWrite',
        'clientsAccess',
        'clientsWrite',
        'configurationsAccess',
        'configurationsWrite'
      ]
    }
  ],
  isSysAdmin: { type: Boolean, default: false }
})

const preSaveFunction: mongoose.PreSaveMiddlewareFunction<User.Document> = async function (next: (_err?: Error) => void) {
  if (this.isModified('password')) {
    try {
      this.password = String(await Bun.password.hash(this.password))
    } catch (err) {
      return next(err as Error)
    }
  }

  return next()
}

UserSchema.pre<User.Document>('save', preSaveFunction)

export default UserSchema
