import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
 // Import useNavigate
 import { useEffect } from "react";
import "./ls.css";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",  // Username is only used for login
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();  // Initialize navigate

 const API_BASE_URL = "http://localhost:8080/api/auth";

  

  // Optional: Any side effects can be handled here
  useEffect(() => {
    console.log("LoginSignup component loaded");
  }, []);

  const handleRedirect = () => {
    navigate("/"); // Redirect to homepage
  };

  const handleCheckboxChange = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate fields
    if (!formData.email || !formData.password || (isSignUp && !formData.fullName) || (!isSignUp && !formData.username)) {
      setError("Please fill in all required fields.");
      return;
    }

    const url = isSignUp ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/login`;
    const payload = isSignUp
      ? { email: formData.email, password: formData.password, fullName: formData.fullName }
      : { email: formData.email, password: formData.password, username: formData.username };  // Include username in login payload

    console.log("Sending Request to:", url);
    console.log("Payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Response Received:", result);

      if (response.ok) {
        setSuccess(isSignUp ? "Signup successful! Please log in." : "Login successful!");
        setFormData({
          email: "",
          password: "",
          fullName: "",  // Reset fullName after signup
          username: "",  // Reset username after login
        });

        // Store username and email in localStorage after successful login
        if (!isSignUp) {
          localStorage.setItem("username", formData.username);// Save username in localStorage
          localStorage.setItem("email", formData.email);  // Save email in localStorage
          
          // Redirect to the dashboard after successful login
          navigate("/dashboard");  // Use navigate to go to the Dashboard
        }
      } else {
        // Specific error handling based on API response
        if (isSignUp && result.message === "User already exists") {
          setError("User already registered. Please log in.");
        } else if (!isSignUp && result.message === "User not found") {
          setError("User not registered. Please sign up.");
        } else {
          setError(result.message || "Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      setError("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="login-signup-wrapper">   
      <div className="login-signup-section">
        <div className="login-signup-container">
          <div className="login-signup-row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="login-signup-section-inner pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In</span>
                  <span>Sign Up</span>
                </h6>
                <input
                  className="login-signup-checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={isSignUp}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="reg-log"></label>
                <div className="login-signup-card-3d-wrap mx-auto">
                  <div className="login-signup-card-3d-wrapper">
                    <div className={`login-signup-card-${isSignUp ? "back" : "front"}`}>
                      <div className="center-wrap">
                        <div className="login-signup-inner-section text-center">
                          <h4 className="mb-4 pb-3">{isSignUp ? "Sign Up" : "Log In"}</h4>
                          {error && <p className="error-message">{error}</p>}
                          {success && <p className="success-message">{success}</p>}
                          {isSignUp && (
                            <div className="form-group">
                              <input
                                type="text"
                                name="fullName"
                                className="form-style"
                                placeholder="Your Full Name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                          )}
                          {/* Username input only for login */}
                          {!isSignUp && (
                            <div className="form-group mt-2">
                              <input
                                type="text"
                                name="username"
                                className="form-style"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                              <i className="input-icon uil uil-user"></i>
                            </div>
                          )}
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              name="email"
                              className="form-style"
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="password"
                              name="password"
                              className="form-style"
                              placeholder="Your Password"
                              value={formData.password}
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <button onClick={handleSubmit} className="btn mt-4">
                            Submit
                          </button>
                          {!isSignUp && (
                            <p className="mb-0 mt-4 text-center">
                              <a href="#0" className="link">
                                Forgot your password?
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add a button at the extreme right */}
      <button
        onClick={handleRedirect}
        className="btn btn-primary mx-2 position-absolute top-0 end-0 m-3 "
        title="Go to Homepage"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default LoginSignup;