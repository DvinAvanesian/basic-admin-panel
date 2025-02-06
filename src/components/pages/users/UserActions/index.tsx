'use client'

import { PageActions } from '@/components/shared'
import { useStore } from '@/components/layout'
import { EditOutlined } from '@mui/icons-material'
import { useEffect } from 'react'

interface Props {
  hasEditPerm: boolean
  userName: string
  userID: string
  strings: any
}

const UserActions: React.FC<Props> = ({ hasEditPerm, userName, strings, userID }) => {
  const { updateUI } = useStore()

  useEffect(() => {
    updateUI({
      dynamicPageNames: [
        {
          str: userID,
          replace: userName
        }
      ]
    })

    return () => {
      updateUI({ dynamicPageNames: [] })
    }
  })

  return (
    <PageActions.Bar sx={{ display: { xs: 'none', lg: 'flex' } }} titles={strings.routeTitles}>
      {hasEditPerm && <PageActions.Button label={strings.general.edit} icon={<EditOutlined />} submit disabled />}
    </PageActions.Bar>
  )
}

export default UserActions
