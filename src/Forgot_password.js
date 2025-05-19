import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import {
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AppBarMain from "./AppBarMain";

const theme = createTheme({
  palette: {
    primary: {
      main: "#94B4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e",
    },
    gradient: {
      main: "#4563DD",
    },
  },
  typography: {
    button: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    width: "50%",
    maxWidth: 600,
    margin: "0 auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("login-background");

    return () => {
      root.classList.remove("login-background");
    };
  }, []);
  const handleSigninSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/forgot_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setError("Ссылка для смены пароля отправлена на почту");
      } else {
        const errorText = await response.text();
        if (errorText.length < 150) {
          setError(errorText);
        } else {
          setError("Ошибка");
        }
      }
    } catch (error) {
      setError("Ошибка сети");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className={classes.root}>
      <AppBarMain />
      <Paper elevation={6} square className={classes.paper}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography component="h1" variant="h5">
            Восстановление пароля
          </Typography>
        </Box>
        <form className={classes.form} onSubmit={handleSigninSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Электронная почта (@edu.hse.ru)"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            sx={{
              marginTop: 2,
              marginBottom: 1,
              backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
            }}
          >
            Восстановить пароль
          </Button>
          <Box mt={5} />
        </form>
      </Paper>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <ForgotPassword />
  </ThemeProvider>
);

export default App;
