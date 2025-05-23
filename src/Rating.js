import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBarMain from "./AppBarMain";
import config from "./config";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ABC4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#4563DD",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    width: "40%",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: theme.spacing(2),
    "& > svg": {
      marginRight: theme.spacing(1),
    },
    "&.MuiTypography-root": {
      marginBottom: theme.spacing(2),
    },
  },
  userCard: {
    width: "80%",
    backgroundImage: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  rank: {
    color: theme.palette.primary.contrastText,
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(2),
  },
  userInfo: {
    marginLeft: theme.spacing(2),
  },
  userName: {
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
  },
  userSubtitle: {
    color: "#nnn",
  },
}));

const Rating = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${config.apiUrl}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("rating-background");

    return () => {
      root.classList.remove("rating-background");
    };
  }, []);
  return (
    <div className={classes.root}>
      <AppBarMain />
      {users.map((user, index) => (
        <Box className={classes.userCard} key={user.id}>
          <Box className={classes.rank}>
            <Typography variant="h4">{index + 1}</Typography>
          </Box>
          <Box className={classes.userInfo}>
            <Typography variant="h6" className={classes.userName}>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" className={classes.userSubtitle}>
              Образовательная программа: {user.courseTitle}
            </Typography>
            <Typography variant="subtitle1" className={classes.userSubtitle}>
              Майнор: {user.minorTitle}
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Rating />
    </ThemeProvider>
  );
}
export default App;
