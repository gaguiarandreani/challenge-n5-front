import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#2196F3", 
    },
    secondary: {
      main: "#FF5722", 
    },
    background: {
      default: "#F0F0F0", 
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", 
    h1: {
      fontSize: "2rem", 
      fontWeight: 600, 
    },
  },
  spacing: 8, 
});

export { customTheme };