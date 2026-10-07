# Budget Application

Budget Application to webowa aplikacja do zarządzania budżetem osobistym. Użytkownik rejestruje przychody i wydatki, przypisuje je do kategorii oraz ustala miesięczne limity budżetowe, a aplikacja prezentuje podsumowania i informuje o przekroczeniu limitów. Aplikacja będzie wdrożona w GCP w izolowanej architekturze trójwarstwowej (Web / API / Database).

**Tablica projektu:** https://github.com/users/kaminskimarcin/projects/2/views/1

---

## Zespół

| Rola | Imię i nazwisko | Nr studenta |
|---|---|---|
| PM / DevOps / Frontend / Backend / DBA | Marcin Kamiński | 76209 |

---

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React (Vite) |
| Backend | Java 21, Spring Boot (Spring Web, Spring Data JPA, Spring Security, Bean Validation) |
| Baza danych | PostgreSQL (Cloud SQL) |
| Chmura | Google Cloud Platform (VPC, Compute Engine, Cloud SQL, Cloud Storage, Cloud NAT) |
| CI/CD | GitHub Actions |
| Kontrola wersji | Git + GitHub |

---

## Architektura

Aplikacja jest zbudowana w izolowanej architekturze trójwarstwowej (3-tier). Każda warstwa działa w osobnej podsieci VPC.

| Warstwa | Podsieć | Dostępność |
|---|---|---|
| Web (nginx + React) | Public Subnet | Publicznie z Internetu (HTTP/HTTPS) |
| API (Spring Boot) | Private Subnet A | Brak publicznego IP, ruch przychodzący tylko z podsieci Web |
| Baza danych (PostgreSQL) | Private Subnet B | Ścisła izolacja, połączenia tylko z serwera aplikacji |

<img width="3200" height="2000" alt="architektura-3tier" src="https://github.com/user-attachments/assets/c6fa5763-94cd-478a-ae88-77da579ec5ed" />

---

## Struktura repozytorium

```
budget-application/
├── backend/    # API – Java 21, Spring Boot
├── config/     # Konfiguracja środowisk (szablony zmiennych środowiskowych)
├── docs/       # Dokumentacja, schematy architektury
├── frontend/   # Interfejs użytkownika – React (Vite)
└── README.md
```

| Folder | Zawartość |
|---|---|
| `backend/` | Kod serwera aplikacji (warstwa logiki, Private Subnet A) |
| `frontend/` | Kod interfejsu użytkownika (warstwa prezentacji, Public Subnet) |
| `config/` | Szablony konfiguracji |
| `docs/` | Dokumentacja projektu i diagramy |

---

## ⚙ Konfiguracja

- Adresy usług (URL API, adres bazy danych, bucket Cloud Storage). Aplikacja odczytuje je ze zmiennych środowiskowych.
- Szablony zmiennych środowiskowych znajdują się w folderze `config/`.

---
