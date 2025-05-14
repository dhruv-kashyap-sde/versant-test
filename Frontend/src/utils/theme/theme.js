import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1b89f7',      // --theme
      light: '#b7d6f5',     // --bg
      dark: '#0056b3',      // --theme-dark
    },
    secondary: {
      main: '#3b3b3b',      // --text-2
      light: '#whitesmoke', // --w
      dark: '#2a2a2a',      
    },
    background: {
      default: '#b7d6f5',   // --bg
      paper: '#ffffff',
    },
    text: {
      primary: '#3b3b3b',   // --text-2
      secondary: '#505050', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,       // --radius
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
          boxShadow: '1px 1px 3px 2px #bbb8b898',  // --shadow
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
          boxShadow: '1px 1px 3px 2px #bbb8b898',  // --shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,  // --radius
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
          boxShadow: '1px 1px 3px 2px #bbb8b898',  // --shadow
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1b89f7',  // --theme
          color: 'whitesmoke',  // --w
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,  // --radius
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#50505098',  // matching --border color
        },
      },
    },
  },
  shadows: [
    'none',
    '1px 1px 3px 2px #bbb8b898',  // --shadow for elevation 1
    // ... other shadow levels can be customized if needed
    // Material UI has 25 elevation levels (0-24)
    // We're just overriding the first two here
  ],
});

export default theme;