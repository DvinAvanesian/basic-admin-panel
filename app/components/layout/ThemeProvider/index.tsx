import createCache, { Options } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssVarsProvider, useTheme } from '@mui/joy'
import CssBaseline from '@mui/joy/CssBaseline'
import { useEffect, useState } from 'react'
import { Box } from '@mui/joy'
import { useStore } from '~/components/layout'
import theme from './theme'

interface Props {
  children: React.ReactNode
  options: Options
  lang: string
}

const ThemeProvider: React.FC<Props> = ({ children, options, lang }) => {
  const t = useTheme()
  const { getUI, updateUI } = useStore()
  const ui = getUI()

  useEffect(() => {
    updateUI({ lang })
  })

  const [{ cache }] = useState(() => {
    const cache = createCache(options)
    cache.compat = true
    const prevInsert = cache.insert
    let inserted: string[] = []
    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const prevInserted = inserted
      inserted = []
      return prevInserted
    }
    return { cache, flush }
  })

  if (typeof window !== 'undefined')
    return (
      <CacheProvider value={cache}>
        <CssVarsProvider theme={theme} defaultMode="system">
          <CssBaseline />
          <Box
            /*  className={ui.lang === 'fa' ? vazir.className : inter.className} */
            sx={{
              position: 'fixed',
              height: '100%',
              width: '100%',
              background: t.vars.palette.background.body,
              direction: ui.lang === 'fa' ? 'rtl' : 'ltr',
              transition: 'background 200ms ease'
            }}
          >
            {children}
          </Box>
        </CssVarsProvider>
      </CacheProvider>
    )
  else return <></>
}

export default ThemeProvider
