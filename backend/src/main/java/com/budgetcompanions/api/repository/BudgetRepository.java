package com.budgetcompanions.api.repository;

import com.budgetcompanions.api.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    boolean existsByCategoryIgnoreCase(String category);

    boolean existsByCategoryIgnoreCaseAndIdNot(String category, Long id);
}
