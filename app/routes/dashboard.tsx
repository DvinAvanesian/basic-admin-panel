import { LocaleManager } from '~/modules'
import { Box, Typography } from '@mui/joy'
import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({ request: req }) => {
  const localeManager = new LocaleManager()
  await localeManager.init(req)
  const { nothingHere } = await localeManager.getStrings('general')

  return Response.json({ nothingHere })
}

const DashboardPage = async () => {
  const { nothingHere } = useLoaderData<typeof loader>()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '70%' }}>
      <Typography>{nothingHere}</Typography>
    </Box>
  )
}

export default DashboardPage
