import { useStore } from '~/components/layout'
import { styled, useTheme } from '@mui/joy'
import { keyframes } from '@mui/material'

const navAppear = keyframes`
  0% {
    transform: translateX(-70%);
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`

const ContainerBox = styled('div')<{ navOpen: boolean; dir: Direction }>(({ theme, navOpen, dir }) => ({
  position: 'absolute',
  width: navOpen ? '70%' : '0%',
  overflowX: 'hidden',
  borderRight: dir === 'ltr' ? `1px solid ${theme.palette.text.primary}20` : 'none',
  borderLeft: dir === 'rtl' ? `1px solid ${theme.palette.text.primary}20` : 'none',
  flexShrink: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: navOpen ? '24px 8px' : '24px 0',
  gap: '16px',
  zIndex: 9999,
  boxSizing: 'border-box',
  background: theme.vars.palette.background.body,
  backdropFilter: 'blur(25px)',
  transition: 'all 300ms cubic-bezier(0,.91,.39,.96),padding 300ms',
  overflow: 'hidden',
  [theme.breakpoints.up('lg')]: {
    position: 'relative',
    width: 'initial',
    flexBasis: navOpen ? '20%' : '0%'
  },
  [theme.breakpoints.up('xl')]: {
    flexBasis: '20%',
    padding: '24px 16px'
  },
  animation: `${navAppear} 500ms cubic-bezier(.17,.67,.4,.98)`
}))

interface Props {
  children: React.ReactNode
  dir: Direction
}

const NavContainer: React.FC<Props> = ({ dir, children }) => {
  const { getUI } = useStore()
  const { navOpen } = getUI()
  const theme = useTheme()

  return <ContainerBox {...{ navOpen, dir, theme }}>{children}</ContainerBox>
}

export default NavContainer
