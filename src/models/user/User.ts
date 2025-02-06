import mongoose, { Model } from 'mongoose'
import UserSchema from './schemas/user'
import type User from './types/User'

const User: Model<User.Document> = mongoose.models.User || mongoose.model<User.Document>('User', UserSchema)

export { User }
