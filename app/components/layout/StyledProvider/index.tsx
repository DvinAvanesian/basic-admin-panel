import { useState } from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import GlobalStyle from './globalStyle'

const StyledProvider = ({ children }: { children: React.ReactNode }) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <GlobalStyle />
      {children}
    </StyleSheetManager>
  )
}

export default StyledProvider
