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
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

const ResetPassword = () => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);

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
    if (success) {
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword, token }),
      });
      if (response.ok) {
        setSuccess(true);
        setError("Пароль успешно изменен. Выполните вход в аккаунт.");
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleconfirmPasswordChange = (event) => {
    setconfirmPassword(event.target.value);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowconfirmPassword = () => {
    setShowconfirmPassword(!showconfirmPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="password"
            autoFocus
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Подтвердите пароль"
            type={showconfirmPassword ? "text" : "password"}
            id="confirmPassword"
            autoComplete="confirmPassword"
            value={confirmPassword}
            onChange={handleconfirmPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowconfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showconfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            Готово
          </Button>
          <Button
            fullWidth
            margin="normal"
            variant="outlined"
            color="gradient"
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
