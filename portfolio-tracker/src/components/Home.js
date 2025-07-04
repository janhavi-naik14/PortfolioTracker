import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./HomePage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';



const HomePage = ({ onSignUpClick }) => {

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUpClick = () => {
    navigate("/login-signup"); // Navigate to the login/signup page
  };

  const handleDashboardRedirect = () => {
    // Check if email or username exists in localStorage
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (email || username) {
      // Redirect to the Dashboard.js file
      navigate("/dashboard");
    } else {
      // Show an alert if the user is not logged in
      alert("User is not logged in!");
    }
  };
  const [typedText, setTypedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const dynamicText = [
    "Welcome to Investment Portfolio Tracker.",
    "Unlock Your Financial Future. Invest Smartly.",
    "Plan Today for a Better Tomorrow.",
    "Your Investments, Your Growth.",
    "Empower Your Wealth Management Journey.",
  ];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  // Typing Effect Logic
  useEffect(() => {
    const typeInterval = setInterval(() => {
      // If there's more text to type
      if (charIndex < dynamicText[currentTextIndex].length) {
        setTypedText((prevText) => prevText + dynamicText[currentTextIndex][charIndex]);
        setCharIndex((prevIndex) => prevIndex + 1);
      } else {
        // Once typing is finished, wait for a while before clearing the text
        clearInterval(typeInterval); // Clear the typing interval to prevent overlap
        setTimeout(() => {
          setTypedText(""); // Clear the text
          setCharIndex(0);   // Reset character index for the next text
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % dynamicText.length); // Move to next text
        }, 2000); // Wait 2 seconds before starting to type the next text
      }
    }, 100); // Typing speed of 100ms per character
  
    return () => clearInterval(typeInterval); // Clean up the interval when the component unmounts or updates
  }, [charIndex, currentTextIndex, dynamicText]);
  

  return (
    <div className="home-page">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo">InvestTrackr</div>
        <input type="text" placeholder="Search..." className="search-bar" />
        <button className="btn signup-btn" onClick={handleDashboardRedirect}>
        Dashboard
      </button>
        <button className="btn signup-btn" onClick={handleSignUpClick}>
        Sign Up
      </button>
      </nav>
   {/* Image Slider Section */}
<div className="image-slider">
  {/* Typing Effect Text */}
  <div className="typing-effect">
    <span className="typed-text">
      {typedText}
    </span>
  </div>
  <Slider {...sliderSettings}>
    <div>
      <img
        src="https://wallpaperaccess.com/full/3734604.jpg"
        alt="Investment Theme 1"
        className="slider-image"
      />
    </div>
    <div>
      <img
        src="https://static.vecteezy.com/system/resources/previews/000/664/393/original/stock-market-or-forex-trading-graph-vector.jpg"
        alt="Investment Theme 2"
        className="slider-image"
      />
    </div>
    <div>
      <img
        src="https://i.pinimg.com/originals/fd/0c/93/fd0c9376e8c15097b446b32177a32cfb.jpg"
        alt="Investment Theme 3"
        className="slider-image"
      />
    </div>
  </Slider>
</div>



     {/* Features Section */}
<div className="features">
  <h2>What We Offer</h2>
  <div className="feature-row">
    <div className="feature-item">
      <img
        src="https://tse3.mm.bing.net/th?id=OIP.ZT1jkYFuhCnrAKVZYLaZOwHaFr&pid=Api&P=0&h=220"
        alt="Advanced Calculation"
        className="feature-image"
      />
      <h3>Advanced Calculation</h3>
      <p>Accurate and efficient financial calculations for informed decisions.</p>
    </div>
    <div className="feature-item">
      <img
        src="https://tse2.mm.bing.net/th?id=OIP.d9RlOO9OCJWDhNzYLXBvawHaEm&pid=Api&P=0&h=220"
        alt="Real-Time Tracking"
        className="feature-image"
      />
      <h3>Real-Time Tracking</h3>
      <p>Stay updated with real-time investment performance data.</p>
    </div>
    <div className="feature-item">
      <img
        src="https://tse3.mm.bing.net/th?id=OIP.BJL6wVM5WBGY8nb329GodQHaE3&pid=Api&P=0&h=220"
        alt="Multiple Portfolios"
        className="feature-image"
      />
      <h3>Multiple Portfolios</h3>
      <p>Manage and track all your portfolios in one place.</p>
    </div>
  </div>
  <div className="feature-row">
    <div className="feature-item">
      <img
        src="https://tse3.mm.bing.net/th?id=OIP.WrJaHpb4Jd6rdfFD3x7fdAHaEK&pid=Api&P=0&h=220"
        alt="Stock Analysis"
        className="feature-image"
      />
      <h3>Stock Analysis</h3>
      <p>Get detailed stock insights to optimize your investments.</p>
    </div>
    <div className="feature-item">
      <img
        src="https://tse2.mm.bing.net/th?id=OIP.Z_IdQOLdyww4sGIqu4-i4wHaEl&pid=Api&P=0&h=220"
        alt="Custom Alerts"
        className="feature-image"
      />
      <h3>Custom Alerts</h3>
      <p>Receive personalized alerts for better investment management.</p>
    </div>
    <div className="feature-item">
      <img
        src="https://tse4.mm.bing.net/th?id=OIP.UBgwvEAJTCtX-wk0OjYjlwHaEK&pid=Api&P=0&h=220"
        alt="Investment Insights"
        className="feature-image"
      />
      <h3>Investment Insights</h3>
      <p>Gain valuable insights to maximize your financial growth.</p>
    </div>
  </div>
</div>
{/* Stock Ticker Section */}
<div className="stock-ticker-container">
  <div className="ticker-wrap">
  <div className="ticker">
  <span>Apple Inc.</span>
  <span>Alphabet Inc. (Google)</span>
  <span>Amazon.com, Inc.</span>
  <span>Tesla, Inc.</span>
  <span>Microsoft Corporation</span>
  <span>Meta Platforms, Inc. (Facebook)</span>
  <span>NVIDIA Corporation</span>
  <span>Alibaba Group</span>
  <span>Intel Corporation</span>
  <span>Netflix, Inc.</span>
  <span>Adobe Inc.</span>
  <span>Salesforce, Inc.</span>
  <span>Oracle Corporation</span>
  <span>PayPal Holdings, Inc.</span>
  <span>Uber Technologies, Inc.</span>
</div>

  </div>
</div>


      {/* Contact Us Section */}
<div className="contact-us">
  <h2>Contact Us</h2>
  <p>If you have any questions, feel free to contact us at:</p>
  <p>Email: <a href="mailto:support@portfoliotracker.com">support@portfoliotracker.com</a></p>
  
  <div className="social-media">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
      <i className="fas fa-facebook"></i>
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
      <i className="fab fa-twitter"></i>
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
      <i className="fab fa-linkedin"></i>
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
      <i className="fab fa-instagram"></i>
    </a>
  </div>
</div>


      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Portfolio Tracker. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
