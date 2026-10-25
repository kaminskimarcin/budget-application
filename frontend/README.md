# Frontend – Budget Application

React 19 + Vite, Bootstrap 5. Warstwa Web uruchamiana w podsieci publicznej `budget-public-web` (10.0.1.0/24). Wszystkie dane pochodzą z REST API (backend Spring Boot), bez danych makietowych.

## Struktura

```
src/
  api/client.js                 # klient REST: GET/POST/PUT/DELETE, obsługa błędów API (ApiError)
  components/                   # lista transakcji, nagłówek strony, stany ładowania/błędu, toasty, okno potwierdzenia
  components/forms/             # formularze: TransactionForm, BudgetForm, GoalForm, pola z komunikatami błędów
  hooks/                        # useApiData (pobieranie + reload), useForm (walidacja i wysyłka), useCrudPage, useToast
  pages/                        # TransactionsPage, BudgetsPage, GoalsPage
  utils/validation.js           # walidacja po stronie klienta (+ testy validation.test.js)
  utils/format.js               # formatowanie kwot (PLN) i procentów
```

## Funkcje

| Adres | Widok | Operacje |
|-------|-------|----------|
| `#/transakcje` | transakcje z podsumowaniem przychodów, wydatków i salda | dodawanie, edycja, usuwanie |
| `#/budzety` | limity w kategoriach z paskami wykorzystania | dodawanie, edycja, usuwanie |
| `#/cele` | cele oszczędnościowe z postępem | dodawanie, edycja, usuwanie |

- Stany interfejsu: szkielet z animacją i spinner przy pierwszym ładowaniu, spinner przy odświeżaniu, zablokowany przycisk „Zapisywanie…” podczas wysyłki, komunikat z przyciskiem „Spróbuj ponownie” przy braku połączenia z API, toasty po sukcesie i przy błędach 400/404/500.
- Walidacja przed wysłaniem: pola wymagane, kwoty (liczba, maks. 2 miejsca po przecinku, > 0), poprawność dat, data transakcji nie z przyszłości, długość tekstów, unikalna kategoria budżetu. Błędy pól zwrócone przez API (`fieldErrors`) są pokazywane przy tych samych polach.
- Po udanym dodaniu formularz jest czyszczony, a lista odświeżana z API.

## Uruchomienie lokalne

```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm install
npm run dev                     # http://localhost:5173, backend musi działać na :8080
npm test                        # testy walidacji (Vitest)
npm run lint
npm run build
```

## Zmienne środowiskowe

| Zmienna | Gdzie | Opis |
|---------|-------|------|
| `VITE_API_BASE_URL` | build (Vite) | adres API; lokalnie `http://localhost:8080/api`, w obrazie Docker domyślnie `/api` |
| `API_UPSTREAM` | kontener Nginx | adres backendu, do którego Nginx przekazuje `/api/`, np. `http://10.0.2.10:8080` |

## Docker (Nginx + reverse proxy)

```bash
docker build -t budget-frontend .
docker run --rm -p 8081:80 -e API_UPSTREAM=http://host.docker.internal:8080 budget-frontend
```

`nginx.conf` jest szablonem: obraz `nginx` przy starcie podstawia `${API_UPSTREAM}`. Wdrożenie na `budget-web-1`: `bash deploy/deploy-gcp.sh`.
