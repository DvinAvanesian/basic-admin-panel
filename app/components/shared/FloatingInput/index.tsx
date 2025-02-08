import { styled } from '@mui/joy/styles'
import Input from '@mui/joy/Input'
import { forwardRef, useId } from 'react'
import { SxProps } from '@mui/joy/styles/types'

const StyledInput = styled('input')({
  border: 'none',
  minWidth: 0,
  outline: 0,
  padding: 0,
  paddingTop: '1em',
  flex: 1,
  color: 'inherit',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  textOverflow: 'ellipsis',
  textTransform: 'lowercase',
  '&::placeholder': {
    opacity: 0,
    transition: '0.1s ease-out'
  },
  '&:focus::placeholder': {
    opacity: 1
  },
  '&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label': {
    top: '0.5rem',
    fontSize: '0.75rem'
  },
  '&:focus ~ label': {
    color: 'var(--Input-focusedHighlight)'
  },
  '&:-webkit-autofill': {
    alignSelf: 'stretch' // to fill the height of the root slot
  },
  '&:-webkit-autofill:not(* + &)': {
    marginInlineStart: 'calc(-1 * var(--Input-paddingInline))',
    paddingInlineStart: 'var(--Input-paddingInline)',
    borderTopLeftRadius: 'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))',
    borderBottomLeftRadius: 'calc(var(--Input-radius) - var(--variant-borderWidth, 0px))'
  }
})

const StyledLabel = styled('label')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  top: 'calc((var(--Input-minHeight) - 1em) / 2)',
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
}))

type FloatingInputProps = {
  label: string
  icon?: React.ReactElement
  password?: boolean
  required?: boolean
  type?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  name?: string
  sx?: SxProps
  error?: boolean
}

const InnerInput = forwardRef<HTMLInputElement, FloatingInputProps & JSX.IntrinsicElements['input']>(({ label, ...props }, ref) => {
  const id = useId()

  return (
    <>
      <StyledInput {...props} ref={ref} id={id} autoCapitalize="off" autoFocus={false} />
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
    </>
  )
})

InnerInput.displayName = 'InnerInput'

const FloatingInput: React.FC<FloatingInputProps> = ({ icon, label, required, type, value, onChange, name, sx, error }) => {
  return (
    <Input
      error={error}
      endDecorator={icon}
      slots={{ input: InnerInput }}
      slotProps={{
        input: { label: label, placeholder: ' ', required, type, value, onChange, name }
      }}
      sx={{
        '--Input-minHeight': '56px',
        '--Input-radius': '6px',
        width: '100%',
        ...sx
      }}
    />
  )
}

export default FloatingInput
