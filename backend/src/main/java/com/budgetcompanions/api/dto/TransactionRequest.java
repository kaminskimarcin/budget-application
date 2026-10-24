package com.budgetcompanions.api.dto;

import com.budgetcompanions.api.model.TransactionType;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull(message = "Data jest wymagana")
        LocalDate date,

        @NotBlank(message = "Opis jest wymagany")
        @Size(max = 255, message = "Opis może mieć maksymalnie 255 znaków")
        String description,

        @NotBlank(message = "Kategoria jest wymagana")
        @Size(max = 100, message = "Kategoria może mieć maksymalnie 100 znaków")
        String category,

        @NotNull(message = "Kwota jest wymagana")
        @Digits(integer = 10, fraction = 2, message = "Kwota może mieć maksymalnie 2 miejsca po przecinku")
        BigDecimal amount,

        @NotNull(message = "Typ jest wymagany (INCOME lub EXPENSE)")
        TransactionType type
) {
}
