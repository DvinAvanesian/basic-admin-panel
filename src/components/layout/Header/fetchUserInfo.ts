'use server'

import { SessionManager } from '@/modules'

const fetchUserInfo = async () => {
  const session = new SessionManager()
  const user = await session.getCurrentUser()
  const { lang } = user.userPrefs
  const { name, surname } = user.userInfo
  const { full: clientName } = user.parent.clientInfo.name

  return {
    userID: user?.userID,
    fullName: `${name[lang] ?? name['en-US']} ${surname[lang] ?? name['en-US']}`,
    client: clientName[lang] ?? clientName['en-US']
  }
}

export default fetchUserInfo
