package com.budgetcompanions.api.service;

import com.budgetcompanions.api.dto.BudgetRequest;
import com.budgetcompanions.api.dto.BudgetResponse;
import com.budgetcompanions.api.exception.BusinessValidationException;
import com.budgetcompanions.api.exception.ResourceNotFoundException;
import com.budgetcompanions.api.model.Budget;
import com.budgetcompanions.api.repository.BudgetRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepository repository;

    public BudgetService(BudgetRepository repository) {
        this.repository = repository;
    }

    public List<BudgetResponse> findAll() {
        return repository.findAll(Sort.by("id")).stream()
                .map(BudgetResponse::from)
                .toList();
    }

    public BudgetResponse findById(Long id) {
        return BudgetResponse.from(getOrThrow(id));
    }

    @Transactional
    public BudgetResponse create(BudgetRequest request) {
        String category = request.category().trim();
        if (repository.existsByCategoryIgnoreCase(category)) {
            throw duplicateCategory(category);
        }
        Budget budget = new Budget();
        apply(budget, category, request);
        return BudgetResponse.from(repository.save(budget));
    }

    @Transactional
    public BudgetResponse update(Long id, BudgetRequest request) {
        Budget budget = getOrThrow(id);
        String category = request.category().trim();
        if (repository.existsByCategoryIgnoreCaseAndIdNot(category, id)) {
            throw duplicateCategory(category);
        }
        apply(budget, category, request);
        return BudgetResponse.from(budget);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Budget getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budżet", id));
    }

    private void apply(Budget budget, String category, BudgetRequest request) {
        budget.setCategory(category);
        budget.setLimit(request.limit());
    }

    private BusinessValidationException duplicateCategory(String category) {
        return new BusinessValidationException("category", "Budżet dla kategorii " + category + " już istnieje");
    }
}
