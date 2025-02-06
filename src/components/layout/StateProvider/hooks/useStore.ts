import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { updateUIState } from '../reducers/ui'
import { updateModalsState } from '../reducers/modals'
import type { Modals } from '../types/modals'
import type { UI } from '../types/ui'
import type { Redux } from '../types/redux'

type DispatchFunc = () => Redux.AppDispatch
const useAppDispatch: DispatchFunc = useDispatch
const useAppSelector: TypedUseSelectorHook<Redux.PanelState> = useSelector

const useStore = () => {
  const dispatch = useAppDispatch()

  const getUI = () => {
    return useAppSelector(state => state.UI) as UI.State
  }

  const getModals = () => {
    return useAppSelector(state => state.modals) as Modals.State
  }

  const updateUI = (payload: UI.Payload) => {
    dispatch(updateUIState(payload))
  }

  const updateModals = (payload: Modals.Payload) => {
    dispatch(updateModalsState(payload))
  }

  return { updateUI, getUI, getModals, updateModals }
}

export default useStore
