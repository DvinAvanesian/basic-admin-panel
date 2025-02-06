import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const NotFound = () => {
  redirect('/dashboard')
}

export default NotFound
