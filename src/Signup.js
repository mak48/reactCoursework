import React, { useState } from 'react'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import {FormControl,InputLabel,Select,MenuItem,} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    width: '50%',
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

const SignUp = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordrep, setPasswordRep] = useState('');
  const [username, setUsername] = useState('');
  const [program, setProgram] = useState('');
  const [minor, setMinor] = useState('');
  const educationalPrograms = [
    'Программная инженерия',
    'Прикладная математика и информатика',
    'Бизнес-информатика', 'Другое']
  const minors = [
    'Анализ данных',
      'Бизнес и менеджмент',
      'Естествознание, математика',
      'История и философия',
      'Культорология, регионоведение',
      'Медиа и коммуникации',
      'Филология и языкознание']

  const handleSigninSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

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
    setUsername(event.target.value)
  }
  const handleProgramChange = (event) => {
      setProgram(event.target.value)
  }
   const handleMinorChange = (event) => {
    setMinor(event.target.value)
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Paper elevation={6} square className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Зарегистрироваться
        </Typography>
        <form className={classes.form} onSubmit={handleSigninSubmit} noValidate>
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Имя пользователя"
            name="username"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={handleUsernameChange}
          />
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
          <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="program-label">Образовательная программа</InputLabel>
          <Select
              labelId="program-label"
              id="program"
              value={program}
              onChange={handleProgramChange}
              label="Образовательная программа"
          >
              {educationalPrograms.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
          </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="normal" required>
        <InputLabel id="minor-label">Майнор</InputLabel>
        <Select
            labelId="minor-label"
            id="minor"
            value={minor}
            onChange={handleMinorChange}
            label="Майнор"
        >
            {minors.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
            ))}
        </Select>
    </FormControl>
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordrep"
            label="Подтвердите пароль"
            type="passwordrep"
            id="passwordrep"
            autoComplete="current-passwordrep"
            value={passwordrep}
            onChange={handlePasswordRepChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Войти
          </Button>
          <Box mt={5} />
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