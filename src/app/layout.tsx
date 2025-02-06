import LoginPage from '@/components/LoginPage'
import { Box } from '@mui/joy'
import { RefreshModal } from '@/components/modals'
import { SessionManager, LocaleManager } from '@/modules'
import { StateProvider, StyledProvider, ThemeProvider, ToastProvider, Nav, Header, Page } from '@/components/layout'

interface Props {
  children: React.ReactNode
}

const RootLayout: React.FC<Props> = async ({ children }) => {
  // create a SessionManager instance for initial data render
  const session = new SessionManager()
  await session.initSession()

  // get the authentication status to see if the user is logged in
  const auth = await session.getAuthStatus()

  // get the user's preferred language
  // TODO: add detection of user's locale if not logged in
  const lang = (await session.getProp<string>('user.userPrefs.lang')) || Bun.env.DEFAULT_LANGUAGE || 'en-US'

  // create a LocaleManager instance to get the strings to render
  const localeManager = new LocaleManager(session)
  const { routeTitles, general, fieldNames, authPage } = await localeManager.getStrings()

  return (
    <html>
      <body tabIndex={-1}>
        {/* the redux state provider */}
        <StateProvider>
          {/* required for styled components to apply global styled */}
          <StyledProvider>
            {/* joy ui theme registry, language is provided to determine the direction */}
            <ThemeProvider options={{ key: 'joy' }} lang={lang}>
              {/* sonner toast provider */}
              <ToastProvider lang="en-US" />
              {/* render the pages if logged in */}
              {auth ? (
                <>
                  <RefreshModal strings={{ ...general, password: fieldNames.password }} />
                  <Header strings={{ routeTitles: routeTitles }} />
                  <Box sx={{ display: 'flex', height: '100%' }}>
                    <Nav dir={lang === 'fa' ? 'rtl' : 'ltr'} />
                    <Page>{children}</Page>
                  </Box>
                </>
              ) : (
                <LoginPage strings={{ ...authPage, ...general }} />
              )}
            </ThemeProvider>
          </StyledProvider>
        </StateProvider>
      </body>
    </html>
  )
}

export default RootLayout
