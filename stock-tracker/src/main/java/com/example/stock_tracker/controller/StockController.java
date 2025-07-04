package com.example.stock_tracker.controller;

import com.example.stock_tracker.model.Stock;
import com.example.stock_tracker.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    // Endpoint to add a new stock
    // Endpoint to fetch all stocks for a user by email
@GetMapping("/all")
public ResponseEntity<?> getAllStocksByEmail(@RequestParam String email) {
    System.out.println("Fetching all stocks for email: " + email); // Log the request
    try {
        // Fetch all stocks for the user
        var stocks = stockService.getAllStocksByEmail(email);
        System.out.println("Fetched stocks: " + stocks); // Log the fetched stocks
        return ResponseEntity.ok(stocks); // Return the list of stocks
    } catch (Exception e) {
        e.printStackTrace(); // Log the exception for debugging
        return ResponseEntity.badRequest().body("Error fetching stocks: " + e.getMessage());
    }
}


    @PostMapping("/add")
    public ResponseEntity<?> addStock(@RequestBody StockRequest stockRequest) {
        System.out.println("Received StockRequest: " + stockRequest); // Log the incoming request
        try {
            // Add stock and include lastUpdated time in the returned Stock object
            Stock stock = stockService.addStock(
                    stockRequest.getEmail(),
                    stockRequest.getStockName(),
                    stockRequest.getTicker(),
                    stockRequest.getQuantity()
            );
            System.out.println("Stock added successfully: " + stock); // Log the added stock
            return ResponseEntity.ok(stock);  // Return the added stock, including lastUpdated time
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.badRequest().body("Error adding stock: " + e.getMessage());
        }
    }


    // Endpoint to edit an existing stock
    @PutMapping("/edit")
    public ResponseEntity<?> editStock(@RequestBody EditStockRequest editStockRequest) {
        System.out.println("Received EditStockRequest: " + editStockRequest); // Log the incoming request
        try {
            // Edit stock and include updated lastUpdated time in the returned Stock object
            Stock updatedStock = stockService.editStock(
                    editStockRequest.getEmail(),
                    editStockRequest.getTicker(),
                    editStockRequest.getNewQuantity()
            );
            System.out.println("Stock edited successfully: " + updatedStock); // Log the updated stock
            return ResponseEntity.ok(updatedStock);  // Return the updated stock, including lastUpdated time
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.badRequest().body("Error editing stock: " + e.getMessage());
        }
    }

    // Endpoint to delete a stock
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteStock(@RequestBody DeleteStockRequest deleteStockRequest) {
        System.out.println("Received DeleteStockRequest: " + deleteStockRequest); // Log the incoming request
        try {
            // Delete stock based on email and ticker
            stockService.deleteStock(
                    deleteStockRequest.getEmail(),
                    deleteStockRequest.getTicker()
            );
            System.out.println("Stock deleted successfully"); // Log success
            return ResponseEntity.ok("Stock deleted successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.badRequest().body("Error deleting stock: " + e.getMessage());
        }
    }

    // DTO for addStock request
    public static class StockRequest {
        private String email;
        private String stockName;
        private String ticker;
        private int quantity;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getStockName() {
            return stockName;
        }

        public void setStockName(String stockName) {
            this.stockName = stockName;
        }

        public String getTicker() {
            return ticker;
        }

        public void setTicker(String ticker) {
            this.ticker = ticker;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        @Override
        public String toString() {
            return "StockRequest{" +
                    "email='" + email + '\'' +
                    ", stockName='" + stockName + '\'' +
                    ", ticker='" + ticker + '\'' +
                    ", quantity=" + quantity +
                    '}';
        }
    }

    // DTO for editStock request
    public static class EditStockRequest {
        private String email;
        private String ticker;
        private int newQuantity;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTicker() {
            return ticker;
        }

        public void setTicker(String ticker) {
            this.ticker = ticker;
        }

        public int getNewQuantity() {
            return newQuantity;
        }

        public void setNewQuantity(int newQuantity) {
            this.newQuantity = newQuantity;
        }

        @Override
        public String toString() {
            return "EditStockRequest{" +
                    "email='" + email + '\'' +
                    ", ticker='" + ticker + '\'' +
                    ", newQuantity=" + newQuantity +
                    '}';
        }
    }

    // DTO for deleteStock request
    public static class DeleteStockRequest {
        private String email;
        private String ticker;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTicker() {
            return ticker;
        }

        public void setTicker(String ticker) {
            this.ticker = ticker;
        }

        @Override
        public String toString() {
            return "DeleteStockRequest{" +
                    "email='" + email + '\'' +
                    ", ticker='" + ticker + '\'' +
                    '}';
        }
    }
}
