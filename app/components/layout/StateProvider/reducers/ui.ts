import { createSlice } from '@reduxjs/toolkit'
import { UI } from '../types/ui'

const initialState: UI.State = {
  navOpen: false,
  pageExiting: false,
  activePage: undefined,
  lang: undefined,
  dynamicPageNames: []
}

const UISlice = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    updateUIState: (state, action: UI.Action) => Object.assign(state, action.payload)
  }
})

export const { updateUIState } = UISlice.actions
export default UISlice.reducer
