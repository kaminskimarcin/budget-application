# Frontend – Budget Application

React + Vite, stylizowanie: Bootstrap 5 (CSS importowany w `src/main.jsx`). Warstwa Web uruchamiana w podsieci publicznej `budget-public-web` (10.0.1.0/24).

## Struktura

```
src/
  api/transactionsApi.js        # dostęp do danych: mock albo REST (VITE_API_BASE_URL)
  components/                   # TransactionList, PageHeader, PageState
  hooks/useApiData.js           # wspólne ładowanie danych (stan ładowania i błędu)
  mocks/                        # transactions.json, budgets.json, goals.json (kształt DTO backendu)
  pages/                        # TransactionsPage, BudgetsPage, GoalsPage
  utils/format.js               # formatowanie kwot (PLN) i procentów
```

Widoki (routing po hashu, bez dodatkowych zależności):

| Adres | Widok |
|-------|-------|
| `#/transakcje` | lista transakcji z podsumowaniem przychodów, wydatków i salda |
| `#/budzety` | limity wydatków w kategoriach z paskami wykorzystania |
| `#/cele` | cele oszczędnościowe z postępem |

## Uruchomienie lokalne

```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm install
npm run dev                     # http://localhost:5173
```

## Zmienne środowiskowe

| Zmienna | Opis |
|---------|------|
| `VITE_API_BASE_URL` | adres backendu (Spring Boot), np. `http://localhost:8080/api` |
| `VITE_USE_MOCK` | `true` – dane z `src/mocks`, `false` – wywołania REST |

Zmienne `VITE_*` są wstawiane w czasie builda. Plik `.env.local` jest w `.gitignore`.

## Docker (Nginx)

```bash
docker build -t budget-frontend .
docker run --rm -p 8081:80 budget-frontend     # http://localhost:8081
# z innym adresem API:
docker build --build-arg VITE_API_BASE_URL=http://10.0.2.10:8080/api --build-arg VITE_USE_MOCK=false -t budget-frontend .
```
