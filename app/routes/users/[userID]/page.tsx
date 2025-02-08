import { Box, Typography } from '@mui/joy'
import { UserActions, PermissionsBox, LogsBox } from '~/components/pages/users'
import { SessionManager, LocaleManager } from '~/modules'
import { User, Log } from '~/models'
import { redirect } from 'next/navigation'
import { connectDB } from '~/lib'
import dayjs from 'dayjs'

interface Props {
  params: Promise<{
    userID: string
  }>
}

export const dynamic = 'force-dynamic'

const UserPage: React.FC<Props> = async ({ params }) => {
  const { userID } = await params
  const session = new SessionManager()
  const { userPrefs, parent: currentClient, permissions } = await session.getCurrentUser()
  const { clientID: currentClientID, _id: currentClientOID } = currentClient
  const localeManager = new LocaleManager(session)
  const strings = await localeManager.getStrings()
  const { lang } = userPrefs
  const adminID = Bun.env.ADMIN_ID || 'admin'

  const permList: UserPermissionStatus[] = []
  const logsList: LogInfo[] = []

  await connectDB()

  const user = await User.findOne({ userID }, ' -__v -creationDate')

  if (!user || (currentClientID !== adminID && !user.parent.equals(currentClientOID))) redirect('/dashboard')

  const logs = await Log.find({ user: user._id })
    .populate('user')
    .populate({ path: 'affected', populate: { path: 'user', model: 'User' } })
    .populate({ path: 'affected', populate: { path: 'client', model: 'Client' } })

  for (const item of logs) {
    const affectedArr: string[] = []
    if (item.affected) {
      for (const i of item.affected.user) {
        affectedArr.push(`${i.userInfo.name[lang]} ${i.userInfo.surname[lang]}`)
      }
      for (const i of item.affected.client) {
        affectedArr.push(i.clientInfo.name.short[lang])
      }
    }
    const affected = affectedArr.length > 0 ? affectedArr.join(', ') : '-'
    logsList.push({
      action: item.action,
      affected,
      date: dayjs(item.date).format('MMM DD HH:mm'),
      group: item.group
    })
  }

  for (const item of Object.keys(strings.permissions)) {
    permList.push({ name: item, enabled: user.permissions.includes(item) })
  }

  const fullName = `${user.userInfo.name[lang]} ${user.userInfo.surname[lang]}`

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', height: '100%', pb: 15 }}>
      <UserActions
        hasEditPerm={permissions.includes('any') || permissions.includes('usersWrite')}
        userName={fullName}
        userID={user.userID}
        strings={{ general: strings.general, routeTitles: strings.routeTitles }}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          pt: 2,
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
          mb: 5,
          flex: '0 0'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3, mt: 2, flexBasis: '0 0 50%' }}>
          <Typography fontSize="2rem">{fullName}</Typography>
          <Typography fontSize="1.1rem" key="index" sx={{ direction: 'ltr', width: 'fit-content' }}>
            +{user.userInfo.contactPhone.countryCode} {user.userInfo.contactPhone.number}
          </Typography>
          <Typography fontSize="1.1rem" key="index">
            {user.userInfo.email}
          </Typography>
        </Box>
        <Box sx={{ flex: '0 0 50%' }}>
          <PermissionsBox
            strings={{ general: strings.general, permissions: strings.permissions, statusMessages: strings.statusMessages }}
            permList={permList}
            userID={user.userID}
          />
        </Box>
      </Box>
      <LogsBox strings={{ ...strings.logTypes, logs: strings.general.logs, ...strings.logs }} logsList={logsList} />
    </Box>
  )
}

export default UserPage
