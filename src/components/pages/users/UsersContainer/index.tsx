'use client'

import { PageActions } from '@/components/shared'
import { UserForm } from '@/components/pages/users'
import { Check } from '@mui/icons-material'
import { Box, Button } from '@mui/joy'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import styled from 'styled-components'
import { useStore } from '@/components/layout'
import { useRouter } from 'next/navigation'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: auto;
`

interface Props {
  strings: any
}

const UsersContainer: React.FC<Props> = ({ strings }) => {
  const [loading, setLoading] = useState(false)
  const [filled, setFilled] = useState(false)
  const router = useRouter()
  const { updateUI, updateModals, getModals } = useStore()
  const authModalOpen = getModals().authModal
  const [reqAuth, setReqAuth] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null) // for scroll

  const handleSuccess = (userID: string) => {
    toast.success(strings.general.createSuccess)
    updateUI({ pageExiting: true })
    router.push(`/users/${userID}`)
  }

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault()

    setLoading(true)
    const res = await fetch('/actions/user', {
      method: 'post',
      body: new FormData(e.target as HTMLFormElement)
    })

    if (res) {
      formRef?.current?.scrollIntoView()
      if (res.status === 201) {
        const { userID } = await res.json()
        handleSuccess(userID)
      }
      if (res.status === 401) {
        setReqAuth(true)
        updateModals({ authModal: true })
      }
      if (res.status === 400 || res.status === 403 || res.status === 415) toast.error(strings.statusMessages.invalidRequest)
      if (res.status === 500) toast.error(strings.statusMessages.internalServerError)
      if (res.status === 409) toast.error(strings.statusMessages.userExists)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authModalOpen === false && reqAuth && submitRef) submitRef.current?.click()
  }, [authModalOpen])

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" ref={formRef}>
      <PageActions.Bar sx={{ display: { xs: 'none', lg: 'flex' } }} titles={strings.routeTitles}>
        <PageActions.Button label={strings.general.save} icon={<Check />} submit loading={loading} disabled={!filled} />
      </PageActions.Bar>
      <Box
        sx={{
          p: 1
        }}
      >
        <Box sx={{ display: 'flex', gap: '1%', flexWrap: 'wrap' }}>
          <UserForm changeFill={setFilled} disabled={loading} strings={{ general: strings.general, fieldNames: strings.fieldNames }} />
          <Button
            type="submit"
            variant="solid"
            disabled={!filled}
            fullWidth
            sx={{ mt: 4, display: { xs: 'flex', lg: 'none' }, gap: 1, mb: 10 }}
            loading={loading}
            size="lg"
            ref={submitRef}
          >
            <Check sx={{ fontSize: '1.3rem' }} />
            {strings.general.save}
          </Button>
        </Box>
      </Box>
    </Form>
  )
}

export default UsersContainer
