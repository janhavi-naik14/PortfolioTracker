package com.example.stock_tracker.service;

import com.example.stock_tracker.model.Stock;
import com.example.stock_tracker.model.User;
import com.example.stock_tracker.repository.StockRepository;
import com.example.stock_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${stock.api.alpha-vantage.key}")
    private String apiKey;

    private static final String ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

    public List<Stock> getAllStocksByEmail(String email) {
    // Fetch user by email to ensure user exists
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

    // Fetch all stocks associated with the user
    return stockRepository.findByUserEmail(email);
}

    public Stock addStock(String email, String stockName, String ticker, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Fetch current price and time from Alpha Vantage
        BigDecimal currentPrice = fetchCurrentPriceFromAlphaVantage(ticker);
        LocalDateTime lastUpdated = LocalDateTime.now(); // Fetch time as LocalDateTime

        Stock stock = new Stock();
        stock.setStockName(stockName);
        stock.setTicker(ticker);
        stock.setQuantity(quantity);
        stock.setBuyPrice(currentPrice);
        stock.setCurrentPrice(currentPrice);
        stock.setUser(user);
        stock.setLastUpdated(lastUpdated); // Set last updated time

        // Dynamically calculate additional fields
        BigDecimal totalInvested = currentPrice.multiply(BigDecimal.valueOf(quantity));
        stock.setTotalInvested(totalInvested);

        BigDecimal totalCurrentValue = currentPrice.multiply(BigDecimal.valueOf(quantity)); // Same as buy price initially
        stock.setTotalCurrentValue(totalCurrentValue);

        BigDecimal ratio = totalCurrentValue.divide(totalInvested, 2, RoundingMode.HALF_UP); // Ratio = current / invested
        stock.setRatio(ratio);

        return stockRepository.save(stock);
    }

    public Stock editStock(String email, String ticker, int newQuantity) {
        Stock stock = stockRepository.findByUserEmailAndTicker(email, ticker);
        if (stock == null) {
            throw new RuntimeException("Stock not found for email: " + email + " and ticker: " + ticker);
        }

        // Fetch current price and time from Alpha Vantage
        BigDecimal newCurrentPrice = fetchCurrentPriceFromAlphaVantage(ticker);
        LocalDateTime lastUpdated = LocalDateTime.now(); // Fetch time as LocalDateTime

        int oldQuantity = stock.getQuantity();
        BigDecimal oldInvestedAmount = stock.getBuyPrice().multiply(BigDecimal.valueOf(oldQuantity));

        // Calculate new weighted average buy price
        BigDecimal newInvestedAmount = newCurrentPrice.multiply(BigDecimal.valueOf(newQuantity));
        int totalQuantity = oldQuantity + newQuantity;
        BigDecimal newBuyPrice = oldInvestedAmount.add(newInvestedAmount).divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);

        // Update stock details
        stock.setQuantity(totalQuantity);
        stock.setBuyPrice(newBuyPrice);
        stock.setCurrentPrice(newCurrentPrice);
        stock.setLastUpdated(lastUpdated); // Set last updated time

        // Update calculated fields
        BigDecimal totalInvested = newBuyPrice.multiply(BigDecimal.valueOf(totalQuantity));
        stock.setTotalInvested(totalInvested);

        BigDecimal totalCurrentValue = newCurrentPrice.multiply(BigDecimal.valueOf(totalQuantity));
        stock.setTotalCurrentValue(totalCurrentValue);

        BigDecimal ratio = totalCurrentValue.divide(totalInvested, 2, RoundingMode.HALF_UP);
        stock.setRatio(ratio);

        return stockRepository.save(stock);
    }

    public void deleteStock(String email, String ticker) {
        Stock stock = stockRepository.findByUserEmailAndTicker(email, ticker);
        if (stock == null) {
            throw new RuntimeException("Stock not found for email: " + email + " and ticker: " + ticker);
        }

        stockRepository.delete(stock);
    }
    private BigDecimal fetchCurrentPriceFromAlphaVantage(String ticker) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s?function=TIME_SERIES_INTRADAY&symbol=%s&interval=1min&apikey=%s",
                ALPHA_VANTAGE_URL, ticker, apiKey);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.containsKey("Error Message")) {
            throw new RuntimeException("Failed to fetch stock data: Invalid ticker or API error.");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (1min)");
        if (timeSeries == null || timeSeries.isEmpty()) {
            throw new RuntimeException("No data available for ticker: " + ticker);
        }

        String latestTime = timeSeries.keySet().stream()
                .max(String::compareTo)
                .orElseThrow(() -> new RuntimeException("No recent data available for ticker: " + ticker));

        @SuppressWarnings("unchecked")
        Map<String, String> latestData = (Map<String, String>) timeSeries.get(latestTime);
        if (!latestData.containsKey("4. close")) {
            throw new RuntimeException("Close price not found for ticker: " + ticker);
        }

        return new BigDecimal(latestData.get("4. close"));
    }

    public void updateStockPrices() {
        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            // Fetch latest price from Alpha Vantage
            BigDecimal currentPrice = fetchCurrentPriceFromAlphaVantage(stock.getTicker());

            // Update current price and other related fields
            stock.setCurrentPrice(currentPrice);
            BigDecimal totalCurrentValue = currentPrice.multiply(BigDecimal.valueOf(stock.getQuantity()));
            stock.setTotalCurrentValue(totalCurrentValue);

            BigDecimal ratio = totalCurrentValue.divide(stock.getTotalInvested(), 2, RoundingMode.HALF_UP);
            stock.setRatio(ratio);

            // Save updated stock information
            stockRepository.save(stock);
        }
    }

    private LocalDateTime fetchLatestTimeFromAlphaVantage(String ticker) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s?function=TIME_SERIES_INTRADAY&symbol=%s&interval=1min&apikey=%s",
                ALPHA_VANTAGE_URL, ticker, apiKey);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.containsKey("Error Message")) {
            throw new RuntimeException("Failed to fetch stock data: Invalid ticker or API error.");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> timeSeries = (Map<String, Object>) response.get("Time Series (1min)");
        if (timeSeries == null || timeSeries.isEmpty()) {
            throw new RuntimeException("No data available for ticker: " + ticker);
        }

        String latestTime = timeSeries.keySet().stream()
                .max(String::compareTo)
                .orElseThrow(() -> new RuntimeException("No recent data available for ticker: " + ticker));

        // Assuming Alpha Vantage returns time in format: "yyyy-MM-dd HH:mm:ss"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime lastUpdated = LocalDateTime.parse(latestTime, formatter);

        return lastUpdated; // Return the latest timestamp as LocalDateTime
    }
}
