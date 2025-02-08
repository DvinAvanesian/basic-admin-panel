export namespace LocaleManager {
  interface Interface {
    init(req: Request): Promise<void>
    getUserLanguage(): Promise<string>
    getStrings(stringsPath?: string): Promise<any>
  }
}
