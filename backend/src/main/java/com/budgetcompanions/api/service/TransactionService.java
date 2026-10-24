package com.budgetcompanions.api.service;

import com.budgetcompanions.api.dto.TransactionRequest;
import com.budgetcompanions.api.dto.TransactionResponse;
import com.budgetcompanions.api.exception.BusinessValidationException;
import com.budgetcompanions.api.exception.ResourceNotFoundException;
import com.budgetcompanions.api.model.Transaction;
import com.budgetcompanions.api.model.TransactionType;
import com.budgetcompanions.api.repository.TransactionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<TransactionResponse> findAll() {
        return repository.findAll(Sort.by("date", "id")).stream()
                .map(TransactionResponse::from)
                .toList();
    }

    public TransactionResponse findById(Long id) {
        return TransactionResponse.from(getOrThrow(id));
    }

    @Transactional
    public TransactionResponse create(TransactionRequest request) {
        Transaction transaction = new Transaction();
        apply(transaction, request);
        return TransactionResponse.from(repository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, TransactionRequest request) {
        Transaction transaction = getOrThrow(id);
        apply(transaction, request);
        return TransactionResponse.from(transaction);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Transaction getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transakcja", id));
    }

    private void apply(Transaction transaction, TransactionRequest request) {
        validateAmount(request);
        transaction.setDate(request.date());
        transaction.setDescription(request.description().trim());
        transaction.setCategory(request.category().trim());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
    }

    private void validateAmount(TransactionRequest request) {
        int sign = request.amount().signum();
        if (sign == 0) {
            throw new BusinessValidationException("amount", "Kwota nie może być równa zero");
        }
        if (request.type() == TransactionType.INCOME && sign < 0) {
            throw new BusinessValidationException("amount", "Przychód musi mieć dodatnią kwotę");
        }
        if (request.type() == TransactionType.EXPENSE && sign > 0) {
            throw new BusinessValidationException("amount", "Wydatek musi mieć ujemną kwotę");
        }
    }
}
