export namespace Modals {
  interface State {
    authModal: boolean
  }

  type Payload = Partial<State>

  type Action = PayloadAction<Payload>
}
