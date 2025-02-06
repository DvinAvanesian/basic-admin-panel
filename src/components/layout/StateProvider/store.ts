import { configureStore } from '@reduxjs/toolkit'
import UI from './reducers/ui'
import modals from './reducers/modals'

const store = configureStore({
  reducer: {
    UI,
    modals
  }
})

export default store
