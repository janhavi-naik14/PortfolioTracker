package com.example.stock_tracker.controller;

import com.example.stock_tracker.model.InvestmentHistory;
import com.example.stock_tracker.service.InvestmentHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentHistoryController {

    private final InvestmentHistoryService investmentHistoryService;

    public InvestmentHistoryController(InvestmentHistoryService investmentHistoryService) {
        this.investmentHistoryService = investmentHistoryService;
    }

    @PostMapping
    public ResponseEntity<InvestmentHistory> addInvestmentHistory(@RequestBody InvestmentHistory investmentHistory) {
        InvestmentHistory savedRecord = investmentHistoryService.saveInvestmentHistory(investmentHistory);
        return ResponseEntity.ok(savedRecord);
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<InvestmentHistory>> getInvestmentHistory(@PathVariable String email) {
        List<InvestmentHistory> historyList = investmentHistoryService.getInvestmentHistoryByEmail(email);
        return ResponseEntity.ok(historyList);
    }
}
