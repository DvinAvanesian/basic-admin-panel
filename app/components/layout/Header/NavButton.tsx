import { useStore } from '~/components/layout'
import { Close, Menu } from '@mui/icons-material'
import { Box, useTheme } from '@mui/joy'

const NavButton = () => {
  const theme = useTheme()
  const { updateUI, getUI } = useStore()
  const { navOpen } = getUI()

  const toggleNav = () => updateUI({ navOpen: !navOpen })

  return (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 50,
        display: { xs: 'flex', xl: 'none' }
      }}
      onClick={toggleNav}
    >
      {navOpen ? (
        <Close sx={{ fontSize: '2rem', color: theme.palette.text.primary }} />
      ) : (
        <Menu sx={{ fontSize: '2rem', color: theme.palette.text.primary }} />
      )}
    </Box>
  )
}

export default NavButton
