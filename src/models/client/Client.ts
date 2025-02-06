import mongoose from 'mongoose'
import ClientSchema from './schemas/client'
import type Client from './types/Client'

const Client = mongoose.models.Client || mongoose.model<Client.Document>('Client', ClientSchema)

export { Client }
