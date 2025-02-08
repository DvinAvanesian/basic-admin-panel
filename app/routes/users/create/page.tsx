import { LocaleManager } from '~/modules'
import { UsersContainer } from '~/components/pages/users'

export const dynamic = 'force-dynamic'

const CreateUserPage = async () => {
  const localeManager = new LocaleManager()
  const strings = await localeManager.getStrings()
  const { fieldNames, statusMessages, general, routeTitles } = strings

  return <UsersContainer strings={{ fieldNames, statusMessages, general, routeTitles }} />
}

export default CreateUserPage
