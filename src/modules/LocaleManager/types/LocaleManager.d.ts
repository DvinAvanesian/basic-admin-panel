export namespace LocaleManager {
  interface Interface {
    init(): Promise<void>
    getUserLanguage(): Promise<string>
    getStrings(stringsPath?: string): Promise<any>
  }
}
