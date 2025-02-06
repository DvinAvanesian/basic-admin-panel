import { LocaleManager } from '@/modules'
import { Box, Typography } from '@mui/joy'

export const dynamic = 'force-dynamic'

const DashboardPage = async () => {
  const localeManager = new LocaleManager()
  const { nothingHere } = await localeManager.getStrings('general')

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '70%' }}>
      <Typography>{nothingHere}</Typography>
    </Box>
  )
}

export default DashboardPage
