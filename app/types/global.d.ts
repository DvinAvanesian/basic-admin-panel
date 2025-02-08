declare global {
  type Direction = 'rtl' | 'ltr'

  type BCP47 = LanguageCode | `${LanguageCode}-${CountryCode}`

  type I18nObject = Record<BCP47, string>

  interface Tel {
    countryCode: `+${CallingCode}`
    number: `${number}`
  }

  interface Titled {
    title: I18nObject
  }

  type Email = string

  type Address = I18nObject

  type Theme = 'light' | 'dark'

  type ThemeOption = Theme | 'system'

  interface UserPermissionStatus {
    name: string
    enabled: boolean
  }

  interface LogInfo {
    action: string
    affected: string
    date: string
    group: string
  }
}

export {}
