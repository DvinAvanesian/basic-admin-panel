'use client'

import { useStore } from '@/components/layout'
import { Box } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

interface Props {
  sx?: SxProps
  children: React.ReactNode
  vertical?: true
}

const InputGroup: React.FC<Props> = ({ sx, children, vertical }) => {
  const store = useStore()
  const { lang } = store.getUI()
  const isFa = lang === 'fa'

  const getRad = () => {
    if (vertical)
      return {
        '& > *:first-child:not(:last-child) > *:first-child:not(:last-child)': {
          borderRadius: '6px 0 0 0 !important'
        },
        '& > *:first-child:not(:last-child) > *:last-child:not(:first-child)': {
          borderRadius: '0 6px 0 0 !important'
        },
        '& > *:last-child:not(:first-child) > *:first-child:not(:last-child)': {
          borderRadius: '0 0 0 6px !important'
        },
        '& > *:last-child:not(:first-child) > *:last-child:not(:first-child)': {
          borderRadius: '0 0 6px 0 !important'
        },
        '& > *:not(:last-child):not(:first-child) > *:first-child, & > *:not(:last-child):not(:first-child) > *:last-child': {
          borderRadius: '0 !important'
        }
      }

    if (isFa)
      return {
        '& > *:first-child:not(:last-child)': {
          borderRadius: '0 6px 6px 0'
        },
        '& > *:last-child:not(:first-child)': {
          borderRadius: '6px 0 0 6px'
        },
        '& > *:not(:first-child), & > *:not(:last-child)': {
          borderRadius: 0
        }
      }

    return {
      '& > *:first-child:not(:last-child)': {
        borderRadius: '6px 0 0 6px'
      },
      '& > *:last-child:not(:first-child)': {
        borderRadius: '0 6px 6px 0'
      },
      '& > *:not(:first-child), & > *:not(:last-child)': {
        borderRadius: 0
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        '& *': {
          fontSize: { xs: '0.9rem', lg: '1rem' }
        },
        '& .MuiButton-root': {
          borderColor: 'var(--variant-outlinedBorder, var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300, #CDD7E1)))'
        },
        ...getRad(),
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

export default InputGroup
