import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import WelcomePage from "./WelcomePage";
import PasswordReset from "./PasswordReset";
import DashboardPage from "./DashboardPage";
import SignUp from "./Signup";
import "./App.css"; 

export default function App() {
  return (
    <Router>
      <div className="app-container"> {/* Apply a class to the container */}
        <nav>
          <ul>
            <li>
              <Link to="/">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/reset">Reset</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<WelcomePage />} />
          <Route path="/reset" element={<PasswordReset />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}