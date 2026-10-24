package com.budgetcompanions.api.dto;

import com.budgetcompanions.api.model.Transaction;
import com.budgetcompanions.api.model.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        LocalDate date,
        String description,
        String category,
        BigDecimal amount,
        TransactionType type
) {
    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDate(),
                transaction.getDescription(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getType()
        );
    }
}
