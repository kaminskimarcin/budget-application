package com.budgetcompanions.api.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " o id " + id + " nie istnieje");
    }
}
