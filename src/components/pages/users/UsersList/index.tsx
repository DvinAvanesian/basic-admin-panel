'use client'

import useTransitionRouter from '@/hooks/useTransitionRouter'
import { Box, Typography, useTheme } from '@mui/joy'
import { Table, Fab } from '@/components/shared'
import { Add } from '@mui/icons-material'
import type { UsersList } from './types'

interface Props {
  data: UsersList.User[]
  strings: any
}

const UsersList: React.FC<Props> = ({ data, strings }) => {
  const theme = useTheme()
  const { route } = useTransitionRouter()

  return (
    <>
      <Table.Row
        sx={{
          position: 'absolute',
          background: `${theme.palette.background.body}40`,
          borderBottom: `1px solid ${theme.palette.text.primary}40`,
          backdropFilter: 'blur(30px)',
          zIndex: 777
        }}
        theme={theme}
        hov={false}
      >
        <Table.Cell sx={{ flexBasis: '45%', flexGrow: 1, px: 4 }}>
          <Typography>{strings.fullName}</Typography>
        </Table.Cell>

        <Table.Cell sx={{ flexBasis: '35%', display: { md: 'block', xs: 'none' } }}>
          <Typography>{strings.lastLogin}</Typography>
        </Table.Cell>
      </Table.Row>
      <Box
        sx={{
          width: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ py: '2.2rem', width: '100%' }} />
        {data.map((item, index) => (
          <Table.Row key={index} theme={theme} hov={true} onClick={() => route(`/users/${item.userID}`, true)}>
            <Table.Cell sx={{ flexBasis: '45%', flexGrow: 1, px: 4 }}>
              <Typography>{item.fullName}</Typography>
            </Table.Cell>
            <Table.Cell sx={{ flexBasis: '35%', display: { md: 'block', xs: 'none' } }}>
              <Typography>{item.lastLogin}</Typography>
            </Table.Cell>
          </Table.Row>
        ))}
      </Box>
      <Fab onClick={() => route('/users/create', true)}>
        <Add />
      </Fab>
    </>
  )
}

export { UsersList }
