import { Schema } from 'mongoose'
import type Client from '../types/Client'

const ContactInfoSchema = new Schema<Client.Contact>({
  phoneNumbers: [
    {
      title: {
        type: Schema.Types.Mixed
      },
      countryCode: { type: String },
      number: { type: String }
    }
  ],
  emails: [
    {
      title: {
        type: Schema.Types.Mixed
      },
      email: { type: String }
    }
  ],
  addresses: [
    {
      title: {
        type: Schema.Types.Mixed
      },
      address: {
        type: Schema.Types.Mixed
      }
    }
  ]
})

export default ContactInfoSchema
