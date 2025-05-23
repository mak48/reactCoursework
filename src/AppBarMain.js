import React from "react";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router";
import { makeStyles } from "@mui/styles";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardPage from "./DashboardPage";
import Rating from "./Rating";
import Comparing from "./Comparing";
import ProfilePage from "./ProfilePage";

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
          <Link
            to={link.to}
            key={index}
            style={{
              marginLeft: theme.spacing(4),
              color: "white",
              textDecoration: "none",
            }}
          >
            <Button color="inherit" sx={{ ml: 0 }}>
              {link.text}
            </Button>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router basename="/reactCoursework">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBarMain />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/compare" element={<Comparing />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
