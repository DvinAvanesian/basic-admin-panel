import mongoose from 'mongoose'
import registerModels from './registerModels'
import { Logger } from '~/modules/'

const connectDB = async (): Promise<void> => {
  if (!mongoose.connection.readyState) {
    try {
      const uri = Bun.env.MONGO_URI || 'mongodb://localhost:27017/'
      await mongoose.connect(uri)
      registerModels()
    } catch (err: any) {
      const logger = new Logger({})
      logger.error({ message: err.message })
    }
  }
}

export default connectDB
