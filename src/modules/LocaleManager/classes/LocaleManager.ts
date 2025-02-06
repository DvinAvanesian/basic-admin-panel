'use server'

import redis from '@/lib/redis'
import { SessionManager } from '@/modules'
import loadFile from '../utils/loadFile'
import type { LocaleManager } from '../types/LocaleManager'

// TODO: add proper logging using Logger

/**
 * LocaleManager Class
 * handles internationalization (i18n) functionality including language management and translation loading
 * implements the LocaleManager interface defined in types/LocaleManager
 */
class LocaleManager implements LocaleManager.Interface {
  // default language to fall back to if user preference is not set
  private defaultLang = Bun.env.DEFAULT_LANG || 'en-US'
  // SessionManager instance for handling user session data
  private session: SessionManager

  // SessionManager instance can be provided if already created wherever LocaleManager is being used
  constructor(session?: SessionManager) {
    this.session = session || new SessionManager()
  }

  // must be called before calling getStrings
  async init() {
    await this.session.initSession()
  }

  // retrieve user language or define the default language if not set
  // ? Throw an error here since user language must be assigned in the db?
  async getUserLanguage(): Promise<string> {
    const userLang = await this.session.getProp<string>('user.userPrefs.lang')
    console.log(this.defaultLang)
    return userLang || this.defaultLang
  }

  // fetch the requested strings from cache or  directly from file if not cached
  async getStrings(stringsPath?: string): Promise<any> {
    const lang = await this.getUserLanguage()
    const cacheKey = `basic-admin-panel:translations:${lang}`

    const cache = (await redis.json.get(cacheKey, {
      path: stringsPath ? `$.${stringsPath}` : '$'
    })) as any[]

    if (cache) return cache[0]

    const loadedStrings = await this.loadStrings(lang, cacheKey, stringsPath)
    return loadedStrings
  }

  // read the translations file for the requested language and build the cache
  private async loadStrings(lang: string, cacheKey: string, stringsPath?: string): Promise<any> {
    try {
      const loadedStrings = await loadFile(lang, cacheKey)

      // return the requested set of strings if a path specified (for example get('home.nav'))
      return stringsPath ? stringsPath.split('.').reduce((o, key) => o?.[key], loadedStrings) : loadedStrings
    } catch (error: any) {
      throw new Error(`Error loading translations: ${error.message}`)
    }
  }
}

export { LocaleManager }
