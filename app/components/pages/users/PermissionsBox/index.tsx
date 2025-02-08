import { ContentBox } from '~/components/shared'
import { useStore } from '~/components/layout'
import { Check, Close, EditOutlined } from '@mui/icons-material'
import { Box, Checkbox, CircularProgress, IconButton } from '@mui/joy'
import { Fragment, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  strings: any
  permList: UserPermissionStatus[]
  userID: string
}

const PermissionsBox: React.FC<Props> = ({ strings, permList, userID }) => {
  const [editMode, setEditMode] = useState(false)
  const [reqAuth, setReqAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateModals, getModals } = useStore()
  const authModalOpen = getModals().authModal
  const [permsState, setPermsState] = useState<UserPermissionStatus[]>(permList)
  const submitRef = useRef<HTMLButtonElement>(null)

  const submit = async () => {
    setLoading(true)
    const permsArr: string[] = []

    for (const item of permsState) {
      if (item.enabled) permsArr.push(item.name)
    }

    const res = await fetch('/actions/perm', {
      method: 'post',
      body: JSON.stringify({
        userID,
        permissions: permsArr
      })
    })

    if (res) {
      setLoading(false)
      if (res.status === 200) {
        setEditMode(false)
        toast.success(strings.statusMessages.updateSuccessful)
      }
      if (res.status === 401) {
        setReqAuth(true)
        updateModals({ authModal: true })
      }
      if (res.status === 500) {
        toast.error(strings.statusMessages.internalServerError)
      }
    }
  }

  useEffect(() => {
    if (authModalOpen === false && reqAuth && submitRef) submitRef.current?.click()
  }, [authModalOpen])

  const cancel = () => {
    setEditMode(false)
    setPermsState(permList)
  }

  return (
    <ContentBox
      label={strings.general.permissions}
      sx={{ height: 200 }}
      innerSx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '66px' }}
      actions={
        <>
          {editMode && !loading && (
            <>
              <IconButton sx={{ justify: 'flex-end', gap: 1 }} onClick={cancel}>
                <Close fontSize="small" />
              </IconButton>
              <IconButton sx={{ justify: 'flex-end', gap: 1 }} onClick={submit} ref={submitRef}>
                <Check fontSize="small" />
              </IconButton>
            </>
          )}
          {!editMode && !loading && (
            <IconButton sx={{ justify: 'flex-end', gap: 1 }} onClick={() => setEditMode(true)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          )}
          {loading && <CircularProgress variant="soft" size="sm" sx={{ mx: 2 }} />}
        </>
      }
    >
      {permsState.map((item, index) => (
        <Fragment key={index}>
          <Box sx={{ height: 30, px: 2 }}>
            <Checkbox
              sx={{ pointerEvents: editMode ? 'all' : 'none' }}
              disabled={!editMode}
              label={strings.permissions[item.name]}
              checked={item.enabled}
              slotProps={{
                root: {
                  onClick: () => {
                    const newList = [...permsState]
                    const index = newList.findIndex(i => i.name === item.name)

                    newList[index].enabled = !newList[index].enabled
                    setPermsState(newList)
                  }
                }
              }}
            />
          </Box>
        </Fragment>
      ))}
    </ContentBox>
  )
}

export default PermissionsBox
