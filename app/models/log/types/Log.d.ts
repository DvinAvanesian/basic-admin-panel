import type { Document as MongooseDocument, Types } from 'mongoose'

namespace Log {
  interface AffectedEntities extends Document {
    user: Types.ObjectId[]
    client: Types.ObjectId[]
  }

  // TODO: define a type for actions

  interface Document {
    action: string
    user: Types.ObjectId
    oldValues: string[]
    newValues: string[]
    message: string
    date: Date
    group: string
    affected: AffectedEntities
  }
}

export default Log
