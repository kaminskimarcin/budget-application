package com.budgetcompanions.api.controller;

import com.budgetcompanions.api.dto.TransactionRequest;
import com.budgetcompanions.api.dto.TransactionResponse;
import com.budgetcompanions.api.exception.ResourceNotFoundException;
import com.budgetcompanions.api.model.TransactionType;
import com.budgetcompanions.api.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = TransactionController.class, properties = "app.cors.allowed-origins=http://localhost:5173")
class TransactionControllerTest {

    private static final TransactionResponse SALARY = new TransactionResponse(
            1L, LocalDate.of(2026, 10, 1), "Wynagrodzenie", "Przychód", new BigDecimal("6500.00"), TransactionType.INCOME);

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService service;

    @Test
    void shouldReturnTransactionList() throws Exception {
        when(service.findAll()).thenReturn(List.of(SALARY));

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Wynagrodzenie"))
                .andExpect(jsonPath("$[0].date").value("2026-10-01"));
    }

    @Test
    void shouldReturn404WhenTransactionMissing() throws Exception {
        when(service.findById(99L)).thenThrow(new ResourceNotFoundException("Transakcja", 99L));

        mockMvc.perform(get("/api/transactions/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldCreateTransaction() throws Exception {
        when(service.create(any(TransactionRequest.class))).thenReturn(SALARY);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"date":"2026-10-01","description":"Wynagrodzenie","category":"Przychód","amount":6500.00,"type":"INCOME"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/transactions/1"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturn400ForInvalidBody() throws Exception {
        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"date":null,"description":"","category":"Jedzenie","amount":-10.00,"type":"EXPENSE"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.date").exists())
                .andExpect(jsonPath("$.fieldErrors.description").exists());
    }

    @Test
    void shouldReturn400ForWrongType() throws Exception {
        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"date":"2026-10-01","description":"Test","category":"Jedzenie","amount":"abc","type":"EXPENSE"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400ForNonNumericId() throws Exception {
        mockMvc.perform(get("/api/transactions/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldDeleteTransaction() throws Exception {
        mockMvc.perform(delete("/api/transactions/1"))
                .andExpect(status().isNoContent());
    }
}
