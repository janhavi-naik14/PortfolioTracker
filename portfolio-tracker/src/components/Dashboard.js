import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import StockForm from './StockForm';
import { useNavigate } from 'react-router-dom';
import InvestmentChart from '../components/InvestmentChart';
import axios from 'axios';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentStock, setCurrentStock] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Hardcoded backend URL
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const namee = localStorage.getItem('username');
    const storedUser = localStorage.getItem('email');
    if (namee) {
      setUsername(namee);
    }
    if (storedUser) {
      fetchStocks(storedUser); // Fetch stocks for the user
    } else {
      alert("No user logged in. Redirecting to login.");
      navigate('/login-signup');
    }
  }, []);

  const fetchStocks = async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/stocks/all?email=${email}`);
      const data = response.data;

      // Validate and ensure data integrity
      const validatedData = data.map((stock) => ({
        ...stock,
        buyPrice: stock.buyPrice || 0,
        currentPrice: stock.currentPrice || 0,
        quantity: stock.quantity || 0,
      }));

      setStocks(validatedData);
      console.log('Fetched stocks:', validatedData);
    } catch (error) {
      console.error('Error fetching stocks:', error.response || error.message);
      alert('Failed to fetch stocks. Please try again later.');
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleFormSubmit = async (stock, mode) => {
    try {
      const email = localStorage.getItem('email');
      if (mode === 'add') {
        const response = await axios.post(`${BASE_URL}/api/stocks/add`, {
          email,
          stockName: stock.name,
          ticker: stock.ticker,
          quantity: stock.quantity,
        });
        setStocks((prevStocks) => [...prevStocks, response.data]);
      } else if (mode === 'edit') {
        const response = await axios.put(`${BASE_URL}/api/stocks/edit`, {
          email,
          ticker: stock.ticker,
          newQuantity: stock.quantity,
        });
        setStocks((prevStocks) =>
          prevStocks.map((s) =>
            s.ticker === stock.ticker ? { ...s, ...response.data } : s
          )
        );
      } else if (mode === 'delete') {
        await axios.delete(`${BASE_URL}/api/stocks/delete`, {
          data: { email, ticker: stock.ticker },
        });
        setStocks((prevStocks) =>
          prevStocks.filter((s) => s.ticker !== stock.ticker)
        );
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to perform the operation. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('stocks');
    alert(`Goodbye, ${username}! You have been logged out.`);
    navigate('/login-signup');
  };

  const totalInvested = stocks.reduce(
    (sum, stock) => sum + (stock.buyPrice * stock.quantity || 0),
    0
  );
  const totalCurrentValue = stocks.reduce(
    (sum, stock) => sum + (stock.currentPrice * stock.quantity || 0),
    0
  );
  const profitLoss = totalCurrentValue - totalInvested;
  const ratio = totalInvested > 0 ? (totalCurrentValue / totalInvested).toFixed(2) : '0.00';

  localStorage.setItem('overallInvested', totalInvested);
  localStorage.setItem('overallCurrentValue', totalCurrentValue);
  localStorage.setItem('profitLossPercentage', profitLoss);

  return (
    <div className="dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <a className="navbar-brand" href="#">InvestTrackr</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <h2 className="ms-auto text-white">{`Welcome, ${username}!`}</h2>
          <div className="ms-auto d-flex flex-wrap">
            <button className="btn signup-btn me-2" onClick={handleHome}>
              Home
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={() => {
                setFormMode('add');
                setShowForm(true);
              }}
            >
              Add Stock
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={() => {
                setFormMode('edit');
                setShowForm(true);
              }}
            >
              Edit Stock
            </button>
            <button
              className="btn btn-danger me-2"
              onClick={() => {
                setFormMode('delete');
                setShowForm(true);
              }}
            >
              Delete Stock
            </button>
            <button className="btn btn-secondary me-2" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </nav>
      <div className="metrics-container p-4">
        <div className="row">
          <div className="col-md-3">
            <h5>Total Invested</h5>
            <p>${totalInvested.toFixed(2)}</p>
          </div>
          <div className="col-md-3">
            <h5>Current Value</h5>
            <p>${totalCurrentValue.toFixed(2)}</p>
          </div>
          <div className="col-md-3">
            <h5>Total Profit/Loss</h5>
            <p style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>${profitLoss.toFixed(2)}</p>
          </div>
          <div className="col-md-3">
            <h5>Ratio (Current/Invested)</h5>
            <p>{ratio}</p>
          </div>
        </div>
      </div>
      <div className="chart-section">
        <InvestmentChart />
      </div>
      <div className="stock-list p-4">
        <h5>My Holdings</h5>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-info">
              <tr>
                <th>Name</th>
                <th>Ticker</th>
                <th>Buying Price</th>
                <th>Quantity</th>
                <th>Current Price</th>
                <th>Total Invested</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>Ratio</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((stock) => {
                  const stockInvested = stock.buyPrice * stock.quantity || 0;
                  const stockCurrentValue = stock.currentPrice * stock.quantity || 0;
                  const stockProfitLoss = stockCurrentValue - stockInvested;
                  const stockRatio = stockInvested > 0
                    ? (stockCurrentValue / stockInvested).toFixed(2)
                    : '0.00';
                  return (
                    <tr key={stock.id}>
                      <td>{stock.stockName}</td>
                      <td>{stock.ticker}</td>
                      <td>${stock.buyPrice.toFixed(2)}</td>
                      <td>{stock.quantity}</td>
                      <td>${stock.currentPrice.toFixed(2)}</td>
                      <td>${stockInvested.toFixed(2)}</td>
                      <td>${stockCurrentValue.toFixed(2)}</td>
                      <td style={{ color: stockProfitLoss >= 0 ? 'green' : 'red' }}>
                        ${stockProfitLoss.toFixed(2)}
                      </td>
                      <td>{stockRatio}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9">No stocks available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <StockForm
          mode={formMode}
          stocks={stocks}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;