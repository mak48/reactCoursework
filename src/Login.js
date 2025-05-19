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

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const response = await fetch("http://localhost:8080/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
          Войти в аккаунт
        </Typography>
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Link to="/forgot_password" variant="body2">
            Забыли пароль?
          </Link>
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
            Войти
          </Button>
          <Button
            fullWidth
            margin="normal"
            variant="outlined"
            color="gradient"
            className={classes.submit}
            component={Link}
            to="/signup"
          >
            Нет учетной записи? Регистрация
          </Button>
          <Box mt={5} />
        </form>
      </Paper>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <Login />
  </ThemeProvider>
);

export default App;
