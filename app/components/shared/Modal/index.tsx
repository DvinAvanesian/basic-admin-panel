import { CloseRounded } from '@mui/icons-material'
import { Box, Theme, useTheme, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Backdrop = styled(Box)<{ open: boolean; theme: Theme }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000060;
  transition: all 200ms cubic-bezier(0.33, 0.59, 0.42, 0.99);
  z-index: 99996;
  opacity: ${p => (p.open ? '1' : '0')};
  pointer-events: ${p => (p.open ? 'all' : 'none')};
`

const ModalBox = styled(Box)<{ open: boolean; theme: Theme; mheight: string }>`
  position: fixed;
  background: ${props => props.theme.palette.background.popup};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 99997;
  pointer-events: ${p => (p.open ? 'all' : 'none')};

  * {
    font-family: inherit !important;
  }

  ${props => props.theme.breakpoints.up('md')} {
    border: 0.5px solid ${props => props.theme.palette.text.primary}20;
    transform: ${p => (p.open ? 'translateY(0px)' : 'translateY(20px)')};
    opacity: ${p => (p.open ? '1' : '0')};
    min-height: 300px;
    min-width: 400px;
    top: calc(20%);
    left: calc(50% - 200px);
    right: calc(50% - 200px);
    border-radius: 10px;
    transition: opacity 300ms, transform 300ms cubic-bezier(0, 0, 0.12, 0.99);
    padding: 40px;
  }

  ${props => props.theme.breakpoints.down('md')} {
    border-top: 0.5px solid ${props => props.theme.palette.text.primary}20;
    height: ${p => p.mheight};
    width: 100vw;
    bottom: 0;
    border-radius: 20px 20px 0 0;
    transition: height 400ms cubic-bezier(0.03, 0.66, 0.21, 0.99);
  }
`

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  sx?: SxProps
  height?: string
}

const Modal: React.FC<Props> = ({ open, onClose, title, children, sx, height }) => {
  const theme = useTheme()
  const [mHeight, setMHeight] = useState('0%')

  useEffect(() => {
    setMHeight(open ? height || '60%' : '0%')
  }, [open])

  return (
    <>
      <Backdrop open={open} onClick={onClose} theme={theme} />
      <ModalBox theme={theme} mheight={mHeight} open={open} sx={{ gap: { xs: 0, md: 6 }, ...sx }}>
        <Box
          sx={{
            width: '100%',
            height: { md: '1rem', xs: '5rem' },
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 6, md: 0 },
            boxSizing: 'border-box',
            flexDirection: 'row'
          }}
        >
          <Typography sx={{ fontSize: '1.4rem', flexGrow: 1, opacity: 0.7 }}>{title}</Typography>
          <Box
            sx={{
              flex: '0 0 content',
              p: 1,
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            <CloseRounded sx={{ color: theme.palette.text.primary, fontSize: '1.5rem', opacity: 0.7 }} />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, px: { xs: 6, md: 0 } }}>{children}</Box>
      </ModalBox>
    </>
  )
}

export default Modal
