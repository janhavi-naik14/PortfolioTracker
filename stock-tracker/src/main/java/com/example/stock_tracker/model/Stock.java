package com.example.stock_tracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.math.RoundingMode;


@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String stockName;

    @Column(nullable = false)
    private String ticker;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal buyPrice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal currentPrice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalInvested;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalCurrentValue;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ratio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;  // New field to store the last update time

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(BigDecimal buyPrice) {
        this.buyPrice = buyPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(BigDecimal totalInvested) {
        this.totalInvested = totalInvested;
    }

    public BigDecimal getTotalCurrentValue() {
        return totalCurrentValue;
    }

    public void setTotalCurrentValue(BigDecimal totalCurrentValue) {
        this.totalCurrentValue = totalCurrentValue;
    }

    public BigDecimal getRatio() {
        return ratio;
    }

    public void setRatio(BigDecimal ratio) {
        this.ratio = ratio;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    // Method to update stock details when quantity changes and update lastUpdated time
    public void updateStockDetails(int newQuantity, BigDecimal newCurrentPrice, LocalDateTime newLastUpdated) {
        int totalQuantity = this.quantity + newQuantity;
        BigDecimal totalInvestment = this.buyPrice.multiply(BigDecimal.valueOf(this.quantity))
                .add(newCurrentPrice.multiply(BigDecimal.valueOf(newQuantity)));
        
        this.buyPrice = totalInvestment.divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);
        this.quantity = totalQuantity;
        this.currentPrice = newCurrentPrice;
        this.totalInvested = this.buyPrice.multiply(BigDecimal.valueOf(this.quantity));
        this.totalCurrentValue = this.currentPrice.multiply(BigDecimal.valueOf(this.quantity));
        this.ratio = this.totalCurrentValue.divide(this.totalInvested, 2, RoundingMode.HALF_UP);
        this.lastUpdated = newLastUpdated;  // Update the lastUpdated timestamp
    }
}
