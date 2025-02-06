export namespace UI {
  interface State {
    navOpen: boolean
    pageExiting: boolean
    activePage: string | undefined
    lang: string | undefined
    dynamicPageNames: {
      str: string
      replace: string
    }[] // dynamic page name for crumb nav
  }

  type Payload = Partial<State>

  type Action = PayloadAction<>
}
