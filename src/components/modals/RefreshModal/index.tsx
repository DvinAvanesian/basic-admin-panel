'use client'

import { useStore } from '@/components/layout'
import { Modal, FloatingInput } from '@/components/shared'
import { useState } from 'react'
import { Box, Button } from '@mui/joy'
import { VpnKeyOutlined } from '@mui/icons-material'

interface Props {
  strings: any
}

const RefreshModal: React.FC<Props> = ({ strings }) => {
  const { getModals, updateModals } = useStore()
  const { authModal } = getModals()
  const [password, setPassword] = useState<string>('')
  const [l, setL] = useState(false)
  const [incorrect, setIncorrect] = useState(false)

  const handleSubmit = async () => {
    setL(true)
    const res = await fetch('/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })
    if (res) {
      setL(false)
      if (res.status === 200) {
        updateModals({ authModal: false })
        setIncorrect(false)
      } else setIncorrect(true)
    }
  }

  return (
    <Modal open={authModal} onClose={() => updateModals({ authModal: false })} title={strings.authRequired} height="40%">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
        <FloatingInput
          error={incorrect}
          label={strings.password}
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          icon={<VpnKeyOutlined />}
        />
        <Button loading={l} disabled={password === ''} loadingPosition="start" size="lg" onClick={handleSubmit}>
          {strings.submit}
        </Button>
      </Box>
    </Modal>
  )
}

export default RefreshModal
