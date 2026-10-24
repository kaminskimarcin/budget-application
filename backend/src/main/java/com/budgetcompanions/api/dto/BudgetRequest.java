package com.budgetcompanions.api.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record BudgetRequest(
        @NotBlank(message = "Kategoria jest wymagana")
        @Size(max = 100, message = "Kategoria może mieć maksymalnie 100 znaków")
        String category,

        @NotNull(message = "Limit jest wymagany")
        @Positive(message = "Limit musi być większy od zera")
        @Digits(integer = 10, fraction = 2, message = "Limit może mieć maksymalnie 2 miejsca po przecinku")
        BigDecimal limit
) {
}
