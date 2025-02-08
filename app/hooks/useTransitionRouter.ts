import { useNavigate } from '@remix-run/react'
import { useStore } from '~/components/layout'

const useTransitionRouter = () => {
  const navigate = useNavigate()
  const { updateUI } = useStore()

  const timeout = 200

  const route = (r: string, sameNav?: true) => {
    updateUI(sameNav ? { pageExiting: true } : { pageExiting: true, activePage: undefined })
    setTimeout(() => {
      navigate(r)
    }, timeout)
  }

  return { route }
}

export default useTransitionRouter
