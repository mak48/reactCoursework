import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, Link } from "react-router";
import Box from "@mui/material/Box";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { makeStyles } from "@mui/styles";
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
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
    marginTop: theme.spacing(10),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  errorText: {
    color: "red",
    marginTop: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
    },
    cursor: "pointer",
  },
  formControl: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 120,
  },
  selectList: {
    maxHeight: "200px",
    overflowY: "scroll",
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordrep, setPasswordRep] = useState("");
  const [showPasswordRep, setShowPasswordRep] = useState(false);
  const [username, setUsername] = useState("");
  const [program, setProgram] = useState("");
  const [minors, setMinors] = useState([]);
  const [minor, setMinor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handlePasswordRepChange = (event) => {
    setPasswordRep(event.target.value);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleProgramChange = (event) => {
    setProgram(event.target.value);
  };
  const handleMinorChange = (event) => {
    setMinor(event.target.value);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowPasswordRep = () => {
    setShowPasswordRep(!showPasswordRep);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("login-background");
    const fetchMinors = async () => {
      try {
        const response = await fetch("http://localhost:8080/minors");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const titles = data.map((minor) => minor.title);
        setMinors(titles);
      } catch (error) {
        console.error("Ошибка при получении списка майноров:", error);
      }
    };

    fetchMinors();
    return () => {
      root.classList.remove("login-background");
    };
  }, []);
  const navigate = useNavigate();
  const handleSigninSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: username,
      email: email,
      courseTitle: program,
      minorTitle: minor,
      password: password,
      confirmPassword: passwordrep,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/auth/process_register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Регистрация прошла успешно!");
        setErrorMessage("");
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        if (errorText.length < 150) {
          setErrorMessage(errorText);
        } else {
          setErrorMessage("Ошибка регистрации");
        }
      }
    } catch (error) {
      setErrorMessage("Ошибка сети");
    }
  };
  return (
    <div className={classes.root}>
      <AppBarMain />
      <Paper elevation={6} square className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Зарегистрироваться
        </Typography>
        <form className={classes.form} onSubmit={handleSigninSubmit} noValidate>
          <TextField
            className={classes.textField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Имя пользователя"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            className={classes.textField}
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
            className={classes.textField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="program"
            label="Образовательная программа"
            name="program"
            autoComplete="program"
            autoFocus
            value={program}
            onChange={handleProgramChange}
          />
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
            required
            className={classes.formControl}
          >
            <InputLabel id="minor-label">Майнор</InputLabel>
            <Select
              labelId="minor-label"
              required
              fullWidth
              id="minor"
              value={minor}
              onChange={handleMinorChange}
              label="Майнор"
              MenuProps={{
                MenuListProps: {
                  className: classes.selectList,
                },
              }}
            >
              {minors.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className={classes.textField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
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
            className={classes.textField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordrep"
            label="Подтвердите пароль"
            type={showPasswordRep ? "text" : "password"}
            id="passwordrep"
            autoComplete="current-password"
            value={passwordrep}
            onChange={handlePasswordRepChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordRep}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPasswordRep ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errorMessage && (
            <Typography
              variant="body2"
              className={classes.errorText}
              align="left"
            >
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            margin="normal"
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
            Зарегистрироваться
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
            Уже есть аккаунт? Войти
          </Button>
          <Box mt={1} />
        </form>
      </Paper>
    </div>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <SignUp />
  </ThemeProvider>
);

export default App;
