import { createSlice } from '@reduxjs/toolkit'
import { Modals } from '../types/modals'

const initialState: Modals.State = {
  authModal: false
}

const globalModals = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    updateModalsState: (state, action: Modals.Action) => Object.assign(state, action.payload)
  }
})

export const { updateModalsState } = globalModals.actions
export default globalModals.reducer
