package com.budgetcompanions.api.dto;

import com.budgetcompanions.api.model.Budget;

import java.math.BigDecimal;

public record BudgetResponse(
        Long id,
        String category,
        BigDecimal limit
) {
    public static BudgetResponse from(Budget budget) {
        return new BudgetResponse(budget.getId(), budget.getCategory(), budget.getLimit());
    }
}
