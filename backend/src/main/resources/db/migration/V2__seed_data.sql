INSERT INTO transactions (transaction_date, description, category, amount, type) VALUES
    ('2026-10-01', 'Wynagrodzenie', 'Przychód', 6500.00, 'INCOME'),
    ('2026-10-02', 'Czynsz za mieszkanie', 'Mieszkanie', -2200.00, 'EXPENSE'),
    ('2026-10-03', 'Zakupy spożywcze – Biedronka', 'Jedzenie', -184.20, 'EXPENSE'),
    ('2026-10-05', 'Bilet miesięczny MPK', 'Transport', -110.00, 'EXPENSE'),
    ('2026-10-07', 'Rachunek za prąd', 'Rachunki', -165.40, 'EXPENSE'),
    ('2026-10-10', 'Zlecenie – projekt strony', 'Przychód', 1200.00, 'INCOME'),
    ('2026-10-12', 'Kino', 'Rozrywka', -58.00, 'EXPENSE'),
    ('2026-10-15', 'Zakupy spożywcze – Lidl', 'Jedzenie', -236.75, 'EXPENSE'),
    ('2026-10-18', 'Internet i telefon', 'Rachunki', -89.99, 'EXPENSE'),
    ('2026-10-20', 'Wpłata na oszczędności', 'Oszczędności', -800.00, 'EXPENSE');

INSERT INTO budgets (category, limit_amount) VALUES
    ('Jedzenie', 900.00),
    ('Mieszkanie', 2200.00),
    ('Transport', 150.00),
    ('Rachunki', 300.00),
    ('Rozrywka', 200.00),
    ('Oszczędności', 800.00);

INSERT INTO goals (name, target_amount, saved_amount, deadline) VALUES
    ('Poduszka finansowa', 20000.00, 12400.00, '2027-06-30'),
    ('Nowy laptop', 5500.00, 3100.00, '2027-02-28'),
    ('Wakacje 2027', 8000.00, 1600.00, '2027-07-15'),
    ('Kurs certyfikacyjny GCP', 1200.00, 1200.00, '2026-12-15');
