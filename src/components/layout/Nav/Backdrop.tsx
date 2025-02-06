'use client'

import { useStore } from '@/components/layout'
import { Box } from '@mui/joy'

const NavBackdrop = () => {
  const { updateUI, getUI } = useStore()
  const { navOpen } = getUI()

  return (
    <Box
      sx={{
        display: { xs: 'initial', lg: 'none' },
        position: 'absolute',
        zIndex: 8888,
        background: '#0006',
        width: '100%',
        height: '100%',
        opacity: navOpen ? 1 : 0,
        pointerEvents: navOpen ? 'all' : 'none',
        transition: 'opacity 400ms cubic-bezier(.17,.67,.36,1)'
      }}
      onClick={() => updateUI({ navOpen: false })}
      onTouchEnd={() => updateUI({ navOpen: false })}
    />
  )
}

export default NavBackdrop
