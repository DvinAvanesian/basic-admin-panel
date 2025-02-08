import { Schema } from 'mongoose'
import type Client from '../types/Client'
import ContactInfoSchema from './contactInfo'

// TODO: should think of a better type for i18n objects

const ClientInfoSchema = new Schema<Client.Info>({
  name: {
    full: {
      type: Schema.Types.Mixed
    },
    short: {
      type: Schema.Types.Mixed
    }
  },
  contactInfo: ContactInfoSchema
})

export default ClientInfoSchema
