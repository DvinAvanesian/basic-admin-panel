import { Typography, Input, Box } from '@mui/joy'
import { every } from 'lodash'
import { useState, useEffect } from 'react'
import { InputGroup } from '~/components/shared'

const F = (s: string) => s !== ''

const InputBox = (props: { children: React.ReactNode; width?: string }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      flexBasis: { lg: props.width || '49.5%', xs: '100%' },
      maxWidth: { lg: props.width || '49.5%', xs: '100%' }
    }}
  >
    {props.children}
  </Box>
)

interface Props {
  changeFill: (_f: boolean) => void
  disabled?: boolean
  strings: any
}

const UserForm: React.FC<Props> = ({ changeFill, disabled, strings }) => {
  const [reqVals, setReqVals] = useState({
    enName: '',
    enSurname: '',
    faName: '',
    faSurname: '',
    phoneCode: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: ''
  })

  useEffect(() => {
    const isFilled = every([
      F(reqVals.enName),
      F(reqVals.enSurname),
      F(reqVals.faName),
      F(reqVals.faSurname),
      F(reqVals.phoneCode),
      F(reqVals.phoneNumber),
      F(reqVals.email),
      F(reqVals.username),
      F(reqVals.password)
    ])

    changeFill(isFilled)
  }, [reqVals])

  const handleChange = (key: keyof typeof reqVals) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setReqVals({
      ...reqVals,
      [key]: event.target.value
    })
  }

  return (
    <>
      <InputBox width="19%">
        <Typography mt={3}>{strings.fieldNames.username}</Typography>
        <InputGroup>
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.name}
            name="username"
            onChange={handleChange('username')}
            value={reqVals.username}
            sx={{ flexBasis: '50%' }}
          />
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.password}
            name="password"
            onChange={handleChange('password')}
            value={reqVals.password}
            sx={{ flexBasis: '50%' }}
          />
        </InputGroup>
      </InputBox>
      <InputBox width="39.5%">
        <Typography mt={3}>{strings.fieldNames.enName}</Typography>
        <InputGroup>
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.name}
            name="enName"
            onChange={handleChange('enName')}
            value={reqVals.enName}
            sx={{ flexBasis: { lg: '60%', xs: '50%' } }}
          />
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.surname}
            name="enSurname"
            onChange={handleChange('enSurname')}
            value={reqVals.enSurname}
            sx={{ flexBasis: { lg: '40%', xs: '50%' } }}
          />
        </InputGroup>
      </InputBox>
      <InputBox width="39.5%">
        <Typography mt={3}>{strings.fieldNames.faName}</Typography>
        <InputGroup>
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.name}
            name="faName"
            onChange={handleChange('faName')}
            value={reqVals.faName}
            sx={{ flexBasis: { lg: '60%', xs: '50%' } }}
          />
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.surname}
            name="faSurname"
            onChange={handleChange('faSurname')}
            value={reqVals.faSurname}
            sx={{ flexBasis: { lg: '40%', xs: '50%' } }}
          />
        </InputGroup>
      </InputBox>

      <InputBox>
        <Typography mt={3}>{strings.fieldNames.phoneNumber}</Typography>
        <InputGroup>
          <Input
            sx={{
              flexBasis: { lg: '15%', xs: '20%' }
            }}
            disabled={disabled}
            placeholder={strings.fieldNames.code}
            name="phoneCode"
            onChange={handleChange('phoneCode')}
            value={reqVals.phoneCode}
          />
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.number}
            name="phoneNumber"
            sx={{ flexGrow: 1, flexBasis: { lg: '60%', xs: '40%' } }}
            onChange={handleChange('phoneNumber')}
            value={reqVals.phoneNumber}
          />
        </InputGroup>
      </InputBox>
      <InputBox>
        <Typography mt={3}>{strings.fieldNames.email}</Typography>
        <InputGroup>
          <Input
            disabled={disabled}
            placeholder={strings.fieldNames.email}
            name="email"
            sx={{ flexGrow: 1, flexBasis: { lg: '80%', xs: '60%' } }}
            onChange={handleChange('email')}
            value={reqVals.email}
          />
        </InputGroup>
      </InputBox>
    </>
  )
}

export default UserForm
