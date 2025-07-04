package com.example.stock_tracker.repository;
import com.example.stock_tracker.model.InvestmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentHistoryRepository extends JpaRepository<InvestmentHistory, Long> {

    List<InvestmentHistory> findByEmailOrderByDateAsc(String email);

}
