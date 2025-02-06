'use client'

import { useStore } from '@/components/layout'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Box, IconButton, Typography, useTheme } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import React from 'react'

interface Props {
  sx?: SxProps
  children?: React.ReactNode
  label?: string
  actions?: React.ReactNode
  innerSx?: SxProps
  onBack?: (() => void) | null
}

const ContentBox: React.FC<Props> = ({ sx, children, label, actions, innerSx, onBack }) => {
  const theme = useTheme()
  const { getUI } = useStore()
  const { lang } = getUI()

  return (
    <Box
      sx={{
        width: '100%',
        background: theme.palette.background.surface,
        borderRadius: 10,
        position: 'relative',
        border: `0.5px solid ${theme.palette.text.primary}20`,
        boxShadow: '0 2px 20px -5px #0004',
        overflow: 'hidden',
        '& *': {
          userSelect: 'none'
        },
        ...sx
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          height: 52,
          borderBottom: '0.5px solid #fff1',
          width: '100%',
          left: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          background: `${theme.palette.background.popup}80`,
          zIndex: 3,
          backdropFilter: 'blur(20px)'
        }}
        className="boxHeader"
      >
        {onBack && (
          <Box sx={{ flex: '0 0 auto', display: 'flex' }}>
            <IconButton sx={{ justify: 'flex-end', gap: 1 }} onClick={onBack} disabled={onBack === null}>
              {lang === 'fa' ? <ArrowForward fontSize="small" /> : <ArrowBack fontSize="small" />}
            </IconButton>
          </Box>
        )}
        <Typography sx={{ fontSize: '1.1rem', color: theme.palette.text.secondary, mx: 1, mt: 0.2 }} className="ContentBox-Title">
          {label}
        </Typography>
        <Box sx={{ flex: '1 1 auto', justifyContent: 'flex-end', display: 'flex' }}>{actions}</Box>
      </Box>
      <Box
        sx={{
          overflow: 'auto',
          maxHeight: '100%',
          pt: '55px',
          pb: '8px',
          ...innerSx
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default ContentBox
