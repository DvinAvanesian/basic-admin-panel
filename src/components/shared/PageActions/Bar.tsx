import { Box, ButtonGroup } from '@mui/joy'
import Nav from './Nav'
import { SxProps, VariantProp } from '@mui/joy/styles/types'

interface Props {
  children?: React.ReactNode
  sx?: SxProps
  buttonVariant?: VariantProp
  titles: any
}

const ActionBar: React.FC<Props> = ({ children, sx, buttonVariant, titles }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <Box sx={{ flex: 1 }}>
        <Nav titles={titles} />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {children && <ButtonGroup variant={buttonVariant || 'solid'}>{children}</ButtonGroup>}
      </Box>
    </Box>
  )
}

export default ActionBar
