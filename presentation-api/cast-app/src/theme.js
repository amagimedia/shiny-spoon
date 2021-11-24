import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: "rgb(9 ,23, 39)",
      paper: "rgb(3 ,30, 60)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#5090D3",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "white",
          "& label.Mui-focused": {
            color: "#1565c0",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1565c0",
              color: "white",
            },
            "&:hover fieldset": {
              borderColor: "#1565c0",
            },
          },
        },
      },
    },
  },
});

export default theme;
