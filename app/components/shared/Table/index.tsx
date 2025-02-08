import { Box, Theme } from '@mui/joy'
import styled from 'styled-components'

const Row = styled(Box)<{ theme: Theme; hov: boolean }>`
  width: 100%;
  padding: 1rem 0.8rem 1rem;
  display: flex;
  align-items: center;
  user-select: none;
  cursor: ${({ hov }) => (hov ? 'pointer' : 'default')};
  &:hover {
    background: ${({ theme, hov }) => (hov ? `${theme.palette.text.primary}10` : 'transparent')};
  }
  &:active {
    background: ${({ theme, hov }) => (hov ? `${theme.palette.text.primary}18` : 'transparent')};
  }
`

const Cell = styled(Box)`
  align-items: center;
  flex-shrink: 0;
`

export { Row, Cell }
