import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overscroll-behavior: none;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  input:-webkit-autofill, input:autofill {
    background: var(--joy-palette-background-surface);
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: var(--variant-outlinedColor, var(--joy-palette-neutral-outlinedColor, var(--joy-palette-neutral-700, #32383E)));
  }
`
export default GlobalStyle
