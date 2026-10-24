CREATE TABLE transactions (
    id               BIGSERIAL PRIMARY KEY,
    transaction_date DATE           NOT NULL,
    description      VARCHAR(255)   NOT NULL,
    category         VARCHAR(100)   NOT NULL,
    amount           NUMERIC(12, 2) NOT NULL,
    type             VARCHAR(10)    NOT NULL,
    CONSTRAINT chk_transactions_type CHECK (type IN ('INCOME', 'EXPENSE')),
    CONSTRAINT chk_transactions_amount_sign CHECK (
        (type = 'INCOME' AND amount > 0) OR (type = 'EXPENSE' AND amount < 0)
    )
);

CREATE INDEX idx_transactions_date ON transactions (transaction_date);

CREATE TABLE budgets (
    id           BIGSERIAL PRIMARY KEY,
    category     VARCHAR(100)   NOT NULL UNIQUE,
    limit_amount NUMERIC(12, 2) NOT NULL CHECK (limit_amount > 0)
);

CREATE TABLE goals (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(150)   NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    saved_amount  NUMERIC(12, 2) NOT NULL CHECK (saved_amount >= 0),
    deadline      DATE           NOT NULL
);
