package com.budgetcompanions.api.dto;

import com.budgetcompanions.api.model.Goal;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalResponse(
        Long id,
        String name,
        BigDecimal targetAmount,
        BigDecimal savedAmount,
        LocalDate deadline
) {
    public static GoalResponse from(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getSavedAmount(),
                goal.getDeadline()
        );
    }
}
