import { useStore } from '~/components/layout'
import { Button } from '@mui/joy'

interface Props {
  onClick?: React.MouseEventHandler
  children?: React.ReactNode
}

const Fab: React.FC<Props> = ({ onClick, children }) => {
  const store = useStore()
  const { lang } = store.getUI()

  return (
    <Button
      onClick={onClick}
      sx={{
        width: 55,
        height: 55,
        borderRadius: 50,
        position: 'fixed',
        bottom: 30,
        left: lang === 'fa' ? 30 : 'initial',
        right: lang === 'fa' ? 'initial' : 30,
        '& .MuiSvgIcon-root': {
          fontSize: '1.5rem'
        }
      }}
    >
      {children}
    </Button>
  )
}

export default Fab
