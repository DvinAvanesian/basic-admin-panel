import { CssVarsThemeOptions, extendTheme } from '@mui/joy'

const themeConfig: CssVarsThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 570,
      md: 768,
      lg: 1024,
      xl: 1536
    }
  },
  components: {
    JoyLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          userSelect: 'none'
        }
      }
    },
    JoyCheckbox: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit'
        }
      }
    },
    JoyButton: {
      defaultProps: {
        variant: 'solid'
      },
      styleOverrides: {
        root: {
          fontFamily: 'inherit'
        }
      }
    },
    JoyInput: {
      defaultProps: {
        size: 'lg'
      },
      styleOverrides: {
        root: {
          fontFamily: 'inherit'
        }
      }
    },
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          transition: 'color 200ms ease'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          transition: 'color 200ms ease'
        }
      }
    }
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#fafffa',
          popup: '#f0f0f0'
        },
        primary: {
          500: '#075276',
          solidBg: '#075276',
          solidColor: '#e8fff8',
          solidActiveBg: '#072652',
          solidHoverBg: '#07305c',
          outlinedBorder: '#075276',
          outlinedHoverBg: '#07527620',
          outlinedActiveBg: '#07527640',
          softColor: '#0b1210'
        },
        neutral: { solidBg: '#d8eaf3', solidColor: '#0b1210', solidHoverBg: '#e8fff8' },
        text: {
          primary: '#292D32'
        }
      }
    },
    dark: {
      palette: {
        background: {
          body: '#111317',
          popup: '#141418',
          surface: '#0e0e12'
        },
        primary: {
          500: '#82a3ca',
          solidBg: '#82a3ca',
          solidColor: '#0b1210',
          solidActiveBg: '#5b709a',
          solidHoverBg: '#6f8ab2',
          outlinedBorder: '#82a3ca',
          outlinedHoverBg: '#82a3ca10',
          outlinedActiveBg: '#82a3ca20',
          softBg: '#82a3ca10'
        },
        neutral: { solidBg: '#1a1e3d', solidColor: '#f0f0fa', solidHoverBg: '#263f4d', solidActiveBg: '#263f4d' },
        text: {
          primary: '#ebfffb'
        }
      }
    }
  }
}

const theme = extendTheme(themeConfig)

export default theme
