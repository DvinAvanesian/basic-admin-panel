'use client'

import { useRouter } from 'next/navigation'

import { useStore } from '@/components/layout'

const useTransitionRouter = () => {
  const router = useRouter()
  const { updateUI } = useStore()

  const timeout = 200

  const route = (r: string, sameNav?: true) => {
    updateUI(sameNav ? { pageExiting: true } : { pageExiting: true, activePage: undefined })
    setTimeout(() => {
      router.push(r)
    }, timeout)
  }

  const { refresh, prefetch } = router

  return { route, prefetch, refresh }
}

export default useTransitionRouter
