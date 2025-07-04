package com.example.stock_tracker.service;

import com.example.stock_tracker.model.InvestmentHistory;
import com.example.stock_tracker.repository.InvestmentHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@Transactional
public class InvestmentHistoryService {

    private final InvestmentHistoryRepository investmentHistoryRepository;

    public InvestmentHistoryService(InvestmentHistoryRepository investmentHistoryRepository) {
        this.investmentHistoryRepository = investmentHistoryRepository;
    }

    public InvestmentHistory saveInvestmentHistory(InvestmentHistory investmentHistory) {
        return investmentHistoryRepository.save(investmentHistory);
    }

    public List<InvestmentHistory> getInvestmentHistoryByEmail(String email) {
        return investmentHistoryRepository.findByEmailOrderByDateAsc(email);
    }
}
