import { Button, VariantProp } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

interface Props {
  label: string
  icon?: React.ReactElement
  onClick?: React.MouseEventHandler
  submit?: true
  variant?: VariantProp
  loading?: boolean
  disabled?: boolean
  sx?: SxProps
}

const ActionButton: React.FC<Props> = ({ label, icon, onClick, submit, variant, loading, disabled, sx }) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        display: 'flex',
        gap: 1,
        '& .MuiSvgIcon-root': {
          fontSize: '1.3rem',
          mt: -0.2
        },
        ...sx
      }}
      type={submit ? 'submit' : 'button'}
      variant={variant}
      loading={loading}
      disabled={disabled}
    >
      {icon}
      {label}
    </Button>
  )
}

export default ActionButton
