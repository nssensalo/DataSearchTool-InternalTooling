import { createTheme } from '@mui/material/styles';
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/700.css'; // Bold

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // A shade of indigo, equivalent to Tailwind's indigo-600
    },
    secondary: {
      main: '#10b981', // A shade of green, equivalent to Tailwind's green-600
    },
    info: {
      main: '#3b82f6', // A shade of blue, equivalent to Tailwind's blue-600
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h3: {
      fontWeight: 700, // Bold
    },
    h5: {
      fontWeight: 500, // Medium
    },
    button: {
      fontWeight: 700, // Bold
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px', // Makes buttons fully rounded
          textTransform: 'none',  // Prevents button text from being all caps by default
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-lg equivalent
        },
      },
    },
    MuiPaper: { // For components like DataTable's container and FilterForm's box
      styleOverrides: {
        root: {
          borderRadius: '8px', // rounded-lg equivalent
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px', // Match overall rounded style for input fields
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Match overall rounded style for select fields
        },
      },
    },
  },
});

export default theme;
