import { Links, LiveReload, Meta, Outlet, useLoaderData, useLocation, useNavigate, useRouteLoaderData } from '@remix-run/react'
import { Box } from '@mui/joy'
import { RefreshModal } from '~/components/modals'
import { SessionManager, LocaleManager } from '~/modules'
import { StateProvider, StyledProvider, ThemeProvider, ToastProvider, Nav, Header, Page } from '~/components/layout'
import { LoaderFunction } from '@remix-run/node'
import { getSid, sidCookie } from '~/lib/util/sid'
import { useEffect } from 'react'

// Loader function to fetch data on the server
export const loader: LoaderFunction = async ({ request }) => {
  let sid = await getSid(request)

  if (!sid) {
    sid = crypto.randomUUID()
  }

  const XFW = request.headers.get('X-Forwarded-For')
  const session = new SessionManager({ sid, XFW })

  await session.initSession(request)

  const auth = await session.getAuthStatus(request)
  const lang = (await session.getProp<string>('user.userPrefs.lang')) || process.env.DEFAULT_LANGUAGE || 'en-US'

  const localeManager = new LocaleManager(session)
  await localeManager.init(request)
  const { routeTitles, general, fieldNames, authPage } = await localeManager.getStrings()

  return Response.json(
    { auth, lang, strings: { routeTitles, general, fieldNames, authPage } },
    {
      headers: {
        'Set-Cookie': await sidCookie.serialize(sid)
      }
    }
  )
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const data = useRouteLoaderData<typeof loader>('root')

  return (
    <StateProvider>
      <StyledProvider>
        {data && (
          <ThemeProvider options={{ key: 'joy' }} lang={data.lang}>
            <ToastProvider lang="en-US" />
            <RefreshModal strings={{ ...data.strings.general, password: data.strings.fieldNames.password }} />
            <Header strings={{ routeTitles: data.strings.routeTitles }} />
            <Box sx={{ display: 'flex', height: '100%' }}>
              <Nav dir={data.lang === 'fa' ? 'rtl' : 'ltr'} />
              <Page>{children}</Page>
            </Box>
          </ThemeProvider>
        )}
      </StyledProvider>
    </StateProvider>
  )
}

const App = () => {
  const { auth, lang } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    alert(location.pathname)
    if (location.pathname === '/') {
      if (auth) navigate('/dashboard')
      else navigate('/login')
    }
  })

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
