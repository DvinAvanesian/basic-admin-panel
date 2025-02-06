import { UsersList } from '@/components/pages/users'
import { connectDB } from '@/lib'
import { Log, User } from '@/models'
import { SessionManager, LocaleManager } from '@/modules'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'

const UsersPage = async () => {
  await connectDB()
  const session = new SessionManager()
  const { userPrefs, parent } = await session.getProp<User.Document>('user', {
    errorIfNotFound: true
  })
  const { userID: currentUserID } = await session.getAuthStatus({ errorIfNotFound: true })
  const users = await User.find({ parent: parent._id, userID: { $ne: currentUserID } }, `userInfo userID`)
  const localeManager = new LocaleManager(session)
  const strings = await localeManager.getStrings('general')
  const { fullName, lastLogin } = strings
  const { lang } = userPrefs

  const data: UsersList.User[] = []

  const logs = await Log.find({ action: 'login' }).sort({ _id: -1 })
  for (const index in users) {
    const item = users[index]
    const logDoc = logs.find(i => i.user.equals(item.id))
    if (logDoc)
      data.push({
        fullName: `${item.userInfo.name[lang]} ${item.userInfo.surname[lang]}`,
        userID: item.userID,
        lastLogin: dayjs(new Date(logDoc.date)).format('MMM DD HH:mm')
      })
    else {
      data.push({
        fullName: `${item.userInfo.name[lang]} ${item.userInfo.surname[lang]}`,
        userID: item.userID,
        lastLogin: '-'
      })
    }
  }

  return <UsersList data={data} strings={{ fullName, lastLogin }} />
}

export default UsersPage
