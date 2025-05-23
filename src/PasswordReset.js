import React from "react";
import { useNavigate } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

function PasswordReset() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Password Reset</h2>
        <button onClick={handleLogin}>Войти</button>
      </div>
    </ThemeProvider>
  );
}

export default PasswordReset;
