package com.example.stock_tracker.repository;

import com.example.stock_tracker.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
    // Find stocks by user email
    List<Stock> findByUserEmail(String email);

    // Find a specific stock by user email and ticker
    @Query("SELECT s FROM Stock s WHERE s.user.email = :email AND s.ticker = :ticker")
    Stock findByUserEmailAndTicker(@Param("email") String email, @Param("ticker") String ticker);
}
