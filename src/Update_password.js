import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { makeStyles } from "@mui/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "50vh",
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

const UpdatePassword = () => {
  const classes = useStyles();

  const [login, setLogin] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleLoginChange = (event) => {
    setLogin(event.target.value);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleUpdatePasswordSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      login: login,
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/update_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Пароль успешно обновлен!");
      } else {
        console.error("Ошибка при обновлении пароля:", response.status);
        const errorData = await response.json();
        console.error("Детали ошибки:", errorData);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Paper elevation={6} square className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Обновление пароля
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleUpdatePasswordSubmit}
          noValidate
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login"
            label="Логин"
            name="login"
            autoComplete="login"
            autoFocus
            value={login}
            onChange={handleLoginChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Текущий пароль"
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Новый пароль"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Подтвердите новый пароль"
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Обновить пароль
          </Button>
          <Box mt={5} />
        </form>
      </Paper>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <UpdatePassword />
  </ThemeProvider>
);

export default App;
