import { useEffect, useState } from 'react'
import fetchUserInfo from './fetchUserInfo'
import { useStore } from '~/components/layout'
import { Avatar, Box, Skeleton, Typography } from '@mui/joy'
import { BusinessOutlined } from '@mui/icons-material'

interface NavProfileInfo {
  client: string
  fullName: string
  userID: string
}

const Profile = () => {
  const [userInfo, setUserInfo] = useState<NavProfileInfo>()
  const store = useStore()
  const { lang } = store.getUI()

  const getUserInfo = async () => {
    if (lang) {
      const res = await fetchUserInfo()
      setUserInfo(res)
    }
  }

  useEffect(() => {
    if (!userInfo) getUserInfo()
  })

  useEffect(() => {
    getUserInfo()
  }, [lang])

  return (
    <Box
      sx={{
        height: 56,
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        px: 1,
        gap: 2,
        my: 2,
        boxSizing: 'border-box',
        '@keyframes textAppear': {
          '0%': {
            opacity: 0
          },
          '100%': {
            opacity: 1
          }
        },
        animation: 'textAppear 400ms ease'
      }}
    >
      {userInfo ? (
        <Avatar sx={{ width: { xs: 42, lg: 50 }, height: { xs: 42, lg: 50 } }} src="/media/logo">
          <BusinessOutlined />
        </Avatar>
      ) : (
        <Skeleton animation="wave" variant="circular" width={48} height={48} />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: { xs: userInfo ? 0 : 1, lg: userInfo ? 0.3 : 1 },
          whiteSpace: 'nowrap'
        }}
      >
        {userInfo ? (
          <>
            <Typography sx={{ fontSize: { xs: '1rem', lg: '1.1rem' } }}>{userInfo.fullName}</Typography>
            <Typography sx={{ fontSize: { xs: '0.7rem', lg: '0.8rem' }, opacity: 0.9 }}>{userInfo.client}</Typography>
          </>
        ) : (
          <>
            <Skeleton animation="wave" variant="text" sx={{ width: 120 }} />
            <Skeleton animation="wave" variant="text" level="body-sm" sx={{ width: 200 }} />
          </>
        )}
      </Box>
    </Box>
  )
}

;<div></div>

export default Profile
