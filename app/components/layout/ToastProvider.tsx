/* import inter from '~/res/fonts/inter'
import vazir from '~/res/fonts/vazir' */
import { Toaster } from 'sonner'

interface Props {
  lang: string
}

const ToastProvider: React.FC<Props> = ({ lang }) => {
  return (
    <Toaster
      richColors
      closeButton
      /*  className={lang === 'fa' ? vazir.className : inter.className} */
      position={lang === 'fa' ? 'bottom-left' : 'bottom-right'}
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
    />
  )
}

export default ToastProvider
