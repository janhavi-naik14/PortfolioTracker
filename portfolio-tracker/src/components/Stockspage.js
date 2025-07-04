import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; 

const StocksPage = () => {
  const mockStocks = [
    {
      symbol: "AAPL",
      price: 150.00,
      percentageChange: 3.45,
      prices: [
        { time: "2023-01-01 09:30", close: 148 },
        { time: "2023-01-01 09:35", close: 150 },
        { time: "2023-01-01 09:40", close: 151 },
      ],
    },
    {
      symbol: "MSFT",
      price: 280.00,
      percentageChange: -1.23,
      prices: [
        { time: "2023-01-01 09:30", close: 285 },
        { time: "2023-01-01 09:35", close: 280 },
        { time: "2023-01-01 09:40", close: 279 },
      ],
    },
    {
      symbol: "GOOGL",
      price: 2750.00,
      percentageChange: 5.67,
      prices: [
        { time: "2023-01-01 09:30", close: 2700 },
        { time: "2023-01-01 09:35", close: 2750 },
        { time: "2023-01-01 09:40", close: 2760 },
      ],
    },
    {
      symbol: "AMZN",
      price: 3400.00,
      percentageChange: -2.34,
      prices: [
        { time: "2023-01-01 09:30", close: 3500 },
        { time: "2023-01-01 09:35", close: 3400 },
        { time: "2023-01-01 09:40", close: 3405 },
      ],
    },
    {
      symbol: "TSLA",
      price: 700.00,
      percentageChange: 1.89,
      prices: [
        { time: "2023-01-01 09:30", close: 690 },
        { time: "2023-01-01 09:35", close: 700 },
        { time: "2023-01-01 09:40", close: 710 },
      ],
    },
  ];

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const sortedStocks = mockStocks.sort((a, b) => b.percentageChange - a.percentageChange);
    setStocks(sortedStocks);
    setLoading(false);
  }, []);

  const renderChart = (data) => {
    const labels = data.map((point) => point.time);
    const chartData = {
      labels,
      datasets: [
        {
          label: "Price",
          data: data.map((point) => point.close),
          borderColor: "green",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          fill: true,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
        tooltip: {
          enabled: false, // Hide tooltips
        },
      },
      scales: {
        x: {
          display: false, // Hide X-axis
        },
        y: {
          display: false, // Hide Y-axis
        },
      },
    };

    return <Line data={chartData} options={chartOptions} />;
  };

  return (
    <div className="container-fluid">
      {/* Navbar Section */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Stock Tracker</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#stocks">Stocks</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Stocks List Section */}
<section id="stocks" className="mt-5">
  <h2 className="text-center mb-4">Stocks List</h2>
  <div className="row">
    {stocks.map((stock) => (
      <div className="col-md-4 mb-4" key={stock.symbol}>
        <div className="card">
          <div className="card-body d-flex justify-content-between align-items-center">
            {/* Stock Details */}
            <div className="d-flex flex-column">
              <h5 className="card-title">{stock.symbol}</h5>
              <p className="card-text">Price: ${stock.price.toFixed(2)}</p>
              <span
                className={`badge ${
                  stock.percentageChange > 0 ? "badge-success" : "badge-danger"
                }`}
              >
                {stock.percentageChange.toFixed(2)}%
              </span>
            </div>
            {/* Chart */}
            <div className="chart-container" style={{ width: "200px", height: "150px" }}>
              {renderChart(stock.prices)}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Contact Us Section */}
      <section id="contact" className="mt-5 mb-5">
        <h2 className="text-center mb-4">Contact Us</h2>
        <div className="text-center">
          <p>If you have any questions, feel free to reach out to us!</p>
          <p>Email: support@stocktracker.com</p>
        </div>
      </section>
    </div>
  );
};

export default StocksPage;
