'use client'

import { ContentBox } from '@/components/shared'
import useTransitionRouter from '@/hooks/useTransitionRouter'
import { Box, Theme, Typography, useTheme } from '@mui/joy'

interface Props {
  strings: any
  logsList: LogInfo[]
}

const Row = (props: { children?: React.ReactNode; theme: Theme; onClick?: React.MouseEventHandler }) => (
  <Box
    sx={{
      height: 50,
      minHeight: 50,
      width: '100%',
      cursor: 'pointer',
      transition: 'background 30ms',
      display: 'flex',
      alignItems: 'center',
      '&:hover': { background: `${props.theme.palette.text.primary}15` },
      '&:active': { background: `${props.theme.palette.text.primary}20` },
      px: 2,
      '& > div': {
        flex: '1'
      }
    }}
    onClick={props.onClick}
  >
    {props.children}
  </Box>
)

const LogsBox: React.FC<Props> = ({ strings, logsList }) => {
  const theme = useTheme()
  const { route } = useTransitionRouter()

  return (
    <ContentBox
      label={strings.logs}
      sx={{ flex: '1', pt: 5, '& .boxHeader': { borderBottom: 'none' } }}
      innerSx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '66px' }}
    >
      <Box
        sx={{
          height: 50,
          width: '100%',
          position: 'absolute',
          top: 52,
          background: `${theme.palette.background.popup}80`,
          borderBottom: '0.5px solid #fff1',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          '& > div': {
            flex: '1'
          }
        }}
      >
        <Box>
          <Typography>{strings.action}</Typography>
        </Box>
        <Box>
          <Typography>{strings.affected}</Typography>
        </Box>
        <Box>
          <Typography>{strings.date}</Typography>
        </Box>
      </Box>
      {logsList.map((item, index) => (
        <Row theme={theme} key={index} onClick={() => route(`/logs/${item.group}`)}>
          <Box>
            <Typography>{strings[item.action]}</Typography>
          </Box>
          <Box>
            <Typography>{item.affected}</Typography>
          </Box>
          <Box>
            <Typography>{item.date}</Typography>
          </Box>
        </Row>
      ))}
    </ContentBox>
  )
}

export default LogsBox
