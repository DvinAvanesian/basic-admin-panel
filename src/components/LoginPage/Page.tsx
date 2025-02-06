'use client'

import { Box, Button, Checkbox } from '@mui/joy'
import styled from 'styled-components'
import { FloatingInput } from '@/components/shared'
import { useEffect, useState } from 'react'
import { PersonOutline, VpnKeyOutlined } from '@mui/icons-material'
import Logo from './Logo'
import { useRouter } from 'next/navigation'
import type { AuthManager } from '@/modules'
import { toast } from 'sonner'

interface ContainerProps {
  exiting: string
}

const Container = styled.form<ContainerProps>`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  width: 100%;
  height: 100%;
  opacity: ${p => (p.exiting === 'true' ? 0 : 1)};
  transform: ${p => (p.exiting === 'true' ? 'scale(0.95)' : 'scale(1)')};
  @keyframes loginAppear {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    30% {
      opacity: 0;
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  animation: loginAppear 1000ms cubic-bezier(0, 0.64, 0.02, 0.99);
  transition: opacity 200ms cubic-bezier(0, -0.08, 0.02, 0.99), transform 500ms cubic-bezier(0.19, 0.82, 0.54, 1);
`

interface Props {
  strings: any
}

const LoginPage: React.FC<Props> = ({ strings }) => {
  const [values, setValues] = useState<AuthManager.Credentials>({ username: undefined, password: undefined })
  const [stayLoggedIn, setStayLoggedIn] = useState(true)
  const [states, setStates] = useState({
    loading: false,
    loginDisabled: true,
    exiting: false
  })

  const router = useRouter()

  const handleLogin: React.FormEventHandler = async e => {
    e.preventDefault()
    setStates(prev => ({
      ...prev,
      loading: true
    }))

    const result = await fetch('/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...values, stayLoggedIn })
    })

    if (result.status === 200) {
      setStates({
        loginDisabled: true,
        loading: false,
        exiting: true
      })
      router.refresh()
    } else {
      setStates(prev => ({
        ...prev,
        loading: false
      }))
      switch (result.status) {
        case 400:
          toast.error(strings.badRequest)
          break
        case 401:
          toast.error(strings.wrongPassword)
          break
        case 404:
          toast.error(strings.invalidUsername)
          break
        case 500:
          toast.error(strings.internalServerError)
          break
      }
    }
  }

  useEffect(
    () =>
      setStates(prev => ({
        ...prev,
        loginDisabled: !values.username || !values.password || values.username === '' || values.password === ''
      })),
    [values]
  )

  return (
    <Container exiting={String(states.exiting)} onSubmit={handleLogin}>
      <Logo />
      <FloatingInput
        value={values.username as string}
        onChange={e => setValues(prev => ({ ...prev, username: e.target.value }))}
        label={strings.username}
        icon={<PersonOutline />}
      />
      <FloatingInput
        value={values.password as string}
        onChange={e => setValues(prev => ({ ...prev, password: e.target.value }))}
        label={strings.password}
        icon={<VpnKeyOutlined />}
        type="password"
      />
      <Box sx={{ height: 30, display: 'flex', width: '100%', alignItems: 'center' }}>
        <Checkbox label={strings.stayLoggedIn} variant="solid" checked={stayLoggedIn} onClick={() => setStayLoggedIn(p => !p)} size="lg" />
      </Box>
      <Button loading={states.loading} size="lg" fullWidth sx={{ mt: 5 }} type="submit" disabled={states.loginDisabled}>
        {strings.login}
      </Button>
    </Container>
  )
}

export default LoginPage
