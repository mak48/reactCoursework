import React from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#94B4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    button: {
      fontSize: "1.2rem",
      textTransform: "none",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "normal",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    textTransform: "none",
    fontFamily: "Roboto, sans-serif",
    ontWeight: "bold",
    color: "white",
  },
  button: {
    marginLeft: theme.spacing(4),
  },
}));

const navLinks = [
  { text: "Главная", to: "/" },
  { text: "Рейтинг пользователей", to: "/rating" },
  { text: "Сравнить майноры", to: "/compare" },
  { text: "Профиль", to: "/profile" },
];

const AppBarMain = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography
          className={classes.title}
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          ПроМайнор
        </Typography>
        {navLinks.map((link, index) => (
          <Button color="inherit" key={index} href={link.to} sx={{ ml: 4 }}>
            {link.text}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarMain />
    </ThemeProvider>
  );
}

export default App;
