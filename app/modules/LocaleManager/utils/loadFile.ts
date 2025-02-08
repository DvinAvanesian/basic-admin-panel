import redis from '~/lib/redis'
import path from 'path'

// TODO: add proper logging with Logger

// function for loading the requested language strings file and build a cache for it
const loadFile = async (lang: string, cacheKey: string) => {
  try {
    // read the file from translations directory of the app's root directory
    const filePath = path.join(process.cwd(), 'translations', `${lang}.json`)
    const translationsFile = Bun.file(filePath)
    const translationsFileContent = await translationsFile.json()
    if (!translationsFileContent) throw new Error('Cannot find translations file')

    // set the cache in redis
    await redis.json.set(cacheKey, '$', translationsFileContent)

    return translationsFileContent
  } catch (error: any) {
    throw new Error(`Error loading translations file: ${error.message}`)
  }
}

export default loadFile
