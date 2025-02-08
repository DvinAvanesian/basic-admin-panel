import type { Document as MongooseDocument, Types } from 'mongoose'

namespace Client {
  interface Name {
    full: I18nObject
    short: I18nObject
  }

  interface Contact {
    phoneNumbers: (Tel & Titled)[]
    emails: (Titled & { email: Email })[]
    addresses: (Titled & { address: Address })[]
  }

  interface Info {
    name: Name
    contactInfo: Contact
  }

  interface Fields {
    clientID: string
    clientInfo: Info
    creationDate: Date
    brandColor: string
    enabled: boolean
  }

  interface Document extends Fields, MongooseDocument {}
}

export default Client
