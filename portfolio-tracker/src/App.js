import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/Home";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./components/Dashboard"; // Import Dashboard component
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<HomePage />} />
          {/* Login/Signup route */}
          <Route path="/login-signup" element={<LoginSignup />} />
          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
