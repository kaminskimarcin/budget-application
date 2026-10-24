package com.budgetcompanions.api.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequest(
        @NotBlank(message = "Nazwa celu jest wymagana")
        @Size(max = 150, message = "Nazwa celu może mieć maksymalnie 150 znaków")
        String name,

        @NotNull(message = "Kwota docelowa jest wymagana")
        @Positive(message = "Kwota docelowa musi być większa od zera")
        @Digits(integer = 10, fraction = 2, message = "Kwota docelowa może mieć maksymalnie 2 miejsca po przecinku")
        BigDecimal targetAmount,

        @NotNull(message = "Odłożona kwota jest wymagana")
        @PositiveOrZero(message = "Odłożona kwota nie może być ujemna")
        @Digits(integer = 10, fraction = 2, message = "Odłożona kwota może mieć maksymalnie 2 miejsca po przecinku")
        BigDecimal savedAmount,

        @NotNull(message = "Termin realizacji jest wymagany")
        LocalDate deadline
) {
}
