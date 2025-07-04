import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StockForm = ({ mode, stockData, onSubmit, onClose }) => {
  const [stock, setStock] = useState({
    id: stockData?.id || null,
    name: stockData?.name || '',
    ticker: stockData?.ticker || '',
    quantity: stockData?.quantity || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock({ ...stock, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fields for add and edit modes
    if (mode !== 'delete' && (!stock.name.trim() || !stock.ticker.trim() || stock.quantity === '')) {
      alert('Please fill out all required fields.');
      return;
    }

    onSubmit(stock, mode);
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'block', zIndex: 1050 }}>
      <div className="modal-content p-4" style={{ maxWidth: '500px', margin: 'auto', backgroundColor: 'white' }}>
        <h5>{mode === 'add' ? 'Add Stock' : mode === 'edit' ? 'Edit Stock' : 'Delete Stock'}</h5>
        <form onSubmit={handleSubmit}>
          {mode !== 'delete' && (
            <div className="form-group">
              <label>Stock Name</label>
              <input
                type="text"
                name="name"
                value={stock.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )}

          {mode !== 'delete' && (
            <div className="form-group">
              <label>Ticker</label>
              <input
                type="text"
                name="ticker"
                value={stock.ticker}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )}

          {mode !== 'delete' && (
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={stock.quantity}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )}

          {mode === 'delete' && (
            <div className="form-group">
              <label>Ticker</label>
              <input
                type="text"
                name="ticker"
                value={stock.ticker}
                onChange={handleChange}
                className="form-control"
              
              />
            </div>
          )}

          {mode === 'delete' && (
            <p className="text-danger">Are you sure you want to delete this stock?</p>
          )}

          <div className="d-flex justify-content-end mt-3">
            <button type="button" className="btn btn-secondary mx-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-${mode === 'delete' ? 'danger' : 'primary'}`}>
              {mode === 'delete' ? 'Delete' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
