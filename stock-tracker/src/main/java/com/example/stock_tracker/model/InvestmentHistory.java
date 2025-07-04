package com.example.stock_tracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "investment_history", uniqueConstraints = {@UniqueConstraint(columnNames = {"email", "date"})})
public class InvestmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "total_invested", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalInvested;

    @Column(name = "total_value", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalValue;

    @Column(name = "profit_loss_percentage", precision = 5, scale = 2)
    private BigDecimal profitLossPercentage;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(BigDecimal totalInvested) {
        this.totalInvested = totalInvested;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public BigDecimal getProfitLossPercentage() {
        return profitLossPercentage;
    }

    public void setProfitLossPercentage(BigDecimal profitLossPercentage) {
        this.profitLossPercentage = profitLossPercentage;
    }
}

