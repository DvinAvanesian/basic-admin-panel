import type { Types, Document as MongooseDocument } from 'mongoose'

// ? add more than one email and phone for users?

namespace User {
  interface Info {
    name: I18nObject
    surname: I18nObject
    contactPhone: Tel
    email: Email
  }

  interface Preferences {
    theme: ThemeOption
    lang: BCP47
  }

  interface Fields<Populate extends boolean = false, IncludeId extends boolean = false> {
    userID: string
    creationDate: Date
    username: string
    parent: Populate extends true ? Client.Document : Types.ObjectId
    password: string
    userInfo: Info
    userPrefs: Preferences
    permissions: string[] // TODO: define a type for available permission
    isSysAdmin: boolean
    _id: IncludeId extends true ? string : never
  }

  interface Document extends Fields, MongooseDocument {}
}

export default User
