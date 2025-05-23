import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import WelcomePage from "./WelcomePage";
import PasswordReset from "./PasswordReset";
import DashboardPage from "./DashboardPage";
import SignUp from "./Process_register";
import "./App.css";
import UpdatePassword from "./Update_password";
import CardDetailPage from "./CardDetailPage";
import ProfilePage from "./ProfilePage";
import ResetPassword from "./Reset_password";
import ForgotPassword from "./Forgot_password";
import Rating from "./Rating";
import Comparing from "./Comparing";

export default function App() {
  return (
    <Router basename="/reactCoursework">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<WelcomePage />} />
          <Route path="/reset" element={<PasswordReset />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/card/:cardId" element={<CardDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/compare" element={<Comparing />} />
        </Routes>
      </div>
    </Router>
  );
}
