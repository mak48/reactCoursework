import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import {
  CssBaseline,
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
    alignItems: "center",
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

const ResetPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");
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
      const response = await fetch("http://localhost:8080/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword, token }),
      });
      if (response.ok) {
        //const data = await response.json();

        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Неправильная почта или пароль");
        console.error("Login failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Ошибка подключения к серверу");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className={classes.root}>
      <AppBarMain />
      <Paper elevation={6} square className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Восстановление пароля
        </Typography>
        <form className={classes.form} onSubmit={handleSigninSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Придумайте новый пароль"
            name="password"
            autoComplete="password"
            autoFocus
            value={password}
            onChange={handlePasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Подтвердите пароль"
            type="confirmPassword"
            id="confirmPassword"
            autoComplete="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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
            }}
          >
            Готово
          </Button>
          <Button
            fullWidth
            margin="normal"
            variant="outlined"
            color="primary"
            className={classes.submit}
            component={Link}
            to="/login"
          >
            Вход в аккаунт
          </Button>
          <Box mt={5} />
        </form>
      </Paper>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <ResetPassword />
  </ThemeProvider>
);

export default App;
