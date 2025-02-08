import { createClient } from 'redis'
import { Logger } from '~/modules'

const port = Bun.env.REDIS_PORT || ''

const redis = createClient({
  url: `redis://localhost:${port}/`
})

redis.on('error', () => Logger.basic('Redis client error', 'error'))

export default redis
