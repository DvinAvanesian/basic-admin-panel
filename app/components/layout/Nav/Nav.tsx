import NavBackdrop from './Backdrop'
import NavContainer from './Container'
import Item from './Item'
import { LocaleManager, SessionManager } from '~/modules'
import protectedRoutes from './protectedRoutes'
import { HomeOutlined } from '@mui/icons-material'

interface Props {
  dir: Direction
}

const Nav: React.FC<Props> = async ({ dir }) => {
  const localeManager = new LocaleManager()
  const strings = await localeManager.getStrings('nav')
  const session = new SessionManager()
  await session.initSession()

  // get the user's permissions for rendering the elements that the user has access to
  const perms = await session.getProp<string[]>('user.permissions')
  const isSysAdmin = await session.getProp<boolean>('user.isSysAdmin')

  if (!perms || !isSysAdmin) throw new Error()

  return (
    <>
      <NavBackdrop />
      <NavContainer dir={dir}>
        <Item label={strings.dashboard} Icon={HomeOutlined} name="dashboard" />
        {protectedRoutes.map((item, index) => {
          if (perms.includes('any') || perms.includes(`${item.name}Access`) /* && (item.sysAdmin === undefined || item.sysAdmin === isSysAdmin) */) {
            return <Item key={index} label={strings[item.name]} Icon={item.icon} name={item.name} />
          }
        })}
      </NavContainer>
    </>
  )
}

export default Nav
