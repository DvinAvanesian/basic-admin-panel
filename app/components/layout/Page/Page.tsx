import { useStore } from '~/components/layout'
import { Box } from '@mui/joy'
import { useLocation } from '@remix-run/react'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

const PageContainer: React.FC<Props> = ({ children }) => {
  const { updateUI, getUI } = useStore()
  const { pageExiting } = getUI()
  const pathname = useLocation().pathname()

  useEffect(() => {
    updateUI({ pageExiting: false, activePage: pathname.split('/')[1] })
  }, [pathname])

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: { xs: '100%', xl: '80%' },
        boxSizing: 'border-box',
        opacity: pageExiting ? 0 : 1,
        overflowY: 'auto',
        transition: 'opacity 200ms ease',
        width: '100%',
        '@keyframes pageEnter': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        animation: 'pageEnter 1000ms ease'
      }}
    >
      {children}
    </Box>
  )
}

export default PageContainer
