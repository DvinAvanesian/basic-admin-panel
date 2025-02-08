export namespace Redux {
  type PanelState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch
}
