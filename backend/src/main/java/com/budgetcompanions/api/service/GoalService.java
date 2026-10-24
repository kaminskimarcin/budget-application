package com.budgetcompanions.api.service;

import com.budgetcompanions.api.dto.GoalRequest;
import com.budgetcompanions.api.dto.GoalResponse;
import com.budgetcompanions.api.exception.ResourceNotFoundException;
import com.budgetcompanions.api.model.Goal;
import com.budgetcompanions.api.repository.GoalRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GoalService {

    private final GoalRepository repository;

    public GoalService(GoalRepository repository) {
        this.repository = repository;
    }

    public List<GoalResponse> findAll() {
        return repository.findAll(Sort.by("deadline", "id")).stream()
                .map(GoalResponse::from)
                .toList();
    }

    public GoalResponse findById(Long id) {
        return GoalResponse.from(getOrThrow(id));
    }

    @Transactional
    public GoalResponse create(GoalRequest request) {
        Goal goal = new Goal();
        apply(goal, request);
        return GoalResponse.from(repository.save(goal));
    }

    @Transactional
    public GoalResponse update(Long id, GoalRequest request) {
        Goal goal = getOrThrow(id);
        apply(goal, request);
        return GoalResponse.from(goal);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Goal getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cel", id));
    }

    private void apply(Goal goal, GoalRequest request) {
        goal.setName(request.name().trim());
        goal.setTargetAmount(request.targetAmount());
        goal.setSavedAmount(request.savedAmount());
        goal.setDeadline(request.deadline());
    }
}
