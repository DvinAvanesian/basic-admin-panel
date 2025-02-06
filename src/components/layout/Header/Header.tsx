'use client'

import { Box, useTheme } from '@mui/joy'
import Profile from './Profile'
import NavButton from './NavButton'
import { usePathname } from 'next/navigation'
import { PageActions } from '@/components/shared'
import { useMediaQuery } from '@mui/material'

interface Props {
  strings: any
}

const Header: React.FC<Props> = ({ strings }) => {
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('lg'))
  const p = usePathname()

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: { xs: 70, md: 80 },
        borderBottom: '0.5px solid #7777',
        alignItems: 'center',
        px: { lg: 3, xs: 2 },
        gap: 1,
        boxSizing: 'border-box',
        background: `${theme.palette.text.primary}05`,
        backdropFilter: 'blur(20px)',
        zIndex: 99999
      }}
    >
      <NavButton />
      {p.split('/').length >= 3 && md ? (
        <PageActions.Nav
          sx={{
            mt: 0.4,
            '@keyframes cnEnter': {
              '0%': {
                opacity: 0
              },
              '100%': {
                opacity: 1
              }
            },
            animation: 'cnEnter 300ms ease'
          }}
          titles={strings.routeTitles}
        />
      ) : (
        <Profile />
      )}
    </Box>
  )
}

export default Header
