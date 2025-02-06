import { Schema } from 'mongoose'
import type Log from '../types/Log'

const AffectedSchema = new Schema<Log.AffectedEntities>({
  user: [{ type: Schema.Types.ObjectId }],
  client: [{ type: Schema.Types.ObjectId }]
})

export default AffectedSchema
