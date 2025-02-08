import { Schema } from 'mongoose'
import type Client from '../types/Client'
import genID from '~/lib/util/genID'
import ClientInfoSchema from './clientInfo'

const ClientSchema = new Schema<Client.Document>({
  clientID: { type: String, default: () => genID(4), unique: true },
  clientInfo: { type: ClientInfoSchema, required: true },
  creationDate: { type: Date, default: Date.now },
  brandColor: { type: String, required: false }
})

export default ClientSchema
