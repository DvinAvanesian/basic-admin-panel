'use client'

import { useStore } from '@/components/layout'
import useTransitionRouter from '@/hooks/useTransitionRouter'
import { Box, Typography, useTheme } from '@mui/joy'
import { SvgIconComponent } from '@mui/icons-material'

interface Props {
  name: string
  label: string
  Icon: SvgIconComponent
}

const Item: React.FC<Props> = ({ name, Icon, label }) => {
  const store = useStore()
  const { activePage } = store.getUI()
  const theme = useTheme()
  const router = useTransitionRouter()

  const handleRoute = () => {
    if (name !== activePage) router.route(`/${name}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { md: 48, xs: 44 },
        display: 'flex',
        alignItems: 'center',
        //pr: 2,
        boxSizing: 'border-box',
        background: activePage === name ? `${theme.palette.neutral.solidBg}a0` : 'none',
        // border: activePage === name ? `0.5px solid ${theme.palette.primary['500']}90` : 'none',
        borderRadius: 7,
        transition: 'background 200ms',
        cursor: activePage !== name ? 'pointer' : 'default',
        position: 'relative',
        '& .MuiSvgIcon-root': {
          color: theme.palette.text.primary,
          fontSize: '1.5rem'
        },
        '&:hover': {
          background: activePage === name ? `${theme.palette.neutral.solidBg}a0` : `${theme.palette.neutral.solidBg}30`
        },
        '&:active': {
          background: activePage === name ? `${theme.palette.neutral.solidBg}a0` : `${theme.palette.neutral.solidBg}60`,
          transition: 'none'
        },
        '&:before': {
          content: '""',
          height: activePage === name ? '40%' : '0%',
          width: '5px',
          background: theme.palette.primary['500'],
          mx: 2,
          borderRadius: 50,
          transition: 'height 200ms cubic-bezier(.17,.67,.4,.98), margin 400ms'
        }
      }}
      onClick={handleRoute}
    >
      <Icon sx={{ color: theme.palette.text.primary }} />

      <Typography
        sx={{
          fontWeight: 500,
          mx: 2,
          overflowX: 'hidden',
          transition: 'width 400ms cubic-bezier(.17,.67,.4,.98)'
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export default Item
