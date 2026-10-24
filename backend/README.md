# Budget API (backend)

REST API aplikacji Budget Application: Java 21, Spring Boot 4, Spring Data JPA, Bean Validation, Flyway, PostgreSQL 16.

## Struktura

```
backend/
├── src/main/java/com/budgetcompanions/api/
│   ├── controller/   # REST: /api/transactions, /api/budgets, /api/goals
│   ├── service/      # logika biznesowa i walidacja reguł
│   ├── repository/   # Spring Data JPA
│   ├── model/        # encje JPA
│   ├── dto/          # obiekty Request/Response
│   ├── exception/    # globalna obsługa błędów
│   └── config/       # CORS
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/ # Flyway: schemat i dane startowe
├── deploy/           # wdrożenie VM DB i API w GCP
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Endpointy

| Metoda | Ścieżka | Opis | Status |
|---|---|---|---|
| GET | `/api/transactions` | lista transakcji | 200 |
| GET | `/api/transactions/{id}` | szczegóły | 200 / 400 / 404 |
| POST | `/api/transactions` | utworzenie | 201 / 400 |
| PUT | `/api/transactions/{id}` | aktualizacja | 200 / 400 / 404 |
| DELETE | `/api/transactions/{id}` | usunięcie | 204 / 404 |

Te same operacje dla `/api/budgets` i `/api/goals`. Nieoczekiwany błąd (np. brak połączenia z bazą) zwraca 500.
Healthcheck: `GET /actuator/health`.

## Konfiguracja

Wszystkie dane dostępowe pochodzą ze zmiennych środowiskowych (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS`).
Lokalnie aplikacja wczytuje je z pliku `.env` (szablon: `.env.example`). Plik `.env` jest w `.gitignore`.
W GCP hasło bazy leży w Secret Manager (`budget-db-password`).

## Uruchomienie lokalne

```bash
cp .env.example .env
docker compose up -d --build
curl http://localhost:8080/api/transactions
```

Bez Dockera: uruchom PostgreSQL, uzupełnij `.env` i wykonaj `mvn spring-boot:run`. Testy: `mvn test`.

## Wdrożenie w GCP (Cloud Shell)

```bash
bash deploy/deploy-db.sh
bash deploy/deploy-api.sh
```

| VM | Podsieć | IP | Tag | Publiczny IP |
|---|---|---|---|---|
| `budget-db-1` (PostgreSQL 16 w Dockerze) | `budget-private-db` | 10.0.3.10 | `db` | brak |
| `budget-api-1` (Spring Boot w Dockerze) | `budget-private-api` | 10.0.2.10 | `api` | brak |

Ruch do bazy (5432) jest dozwolony tylko z podsieci API, a do API (8080) tylko z podsieci Web.
