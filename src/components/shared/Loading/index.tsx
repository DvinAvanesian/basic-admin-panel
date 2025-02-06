import { Box, CircularProgress } from '@mui/joy'

const LoadingPage = () => {
  return (
    <Box sx={{ width: '100%', height: '95%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size="lg" sx={{ transform: 'scale(1.2)' }} />
    </Box>
  )
}

export default LoadingPage
