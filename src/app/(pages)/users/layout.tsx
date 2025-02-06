import { SessionManager } from '@/modules'
import { redirect } from 'next/navigation'

interface IProps {
  children: React.ReactNode
}

const UsersLayout: React.FC<IProps> = async ({ children }) => {
  const session = new SessionManager()
  await session.initSession()
  const perms = await session.getProp<string[]>('user.permissions')

  if (perms.includes('usersAccess') || perms.includes('any')) return <>{children}</>
  else redirect('/dashboard')
}

export default UsersLayout
