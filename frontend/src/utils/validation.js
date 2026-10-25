const AMOUNT_PATTERN = /^\d{1,10}([.,]\d{1,2})?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseAmount(value) {
  return Number(String(value).trim().replace(',', '.'));
}

export function today() {
  return new Date().toLocaleDateString('sv-SE');
}

function isValidDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toLocaleDateString('sv-SE') === value;
}

function checkText(value, label, max) {
  const text = String(value ?? '').trim();
  if (!text) return `${label} jest wymagane.`;
  if (text.length > max) return `${label} może mieć maksymalnie ${max} znaków.`;
  return undefined;
}

function checkAmount(value, label, { allowZero = false } = {}) {
  const text = String(value ?? '').trim();
  if (!text) return `${label} jest wymagana.`;
  if (text.startsWith('-')) return `${label} nie może być ujemna.`;
  if (!AMOUNT_PATTERN.test(text)) return `${label} musi być liczbą z maksymalnie 2 miejscami po przecinku.`;
  const amount = parseAmount(text);
  if (!allowZero && amount <= 0) return `${label} musi być większa od zera.`;
  return undefined;
}

function checkDate(value, label) {
  if (!value) return `${label} jest wymagana.`;
  if (!isValidDate(value)) return `${label} ma niepoprawny format (RRRR-MM-DD).`;
  return undefined;
}

function compact(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}

export function validateTransaction(values) {
  const errors = {
    date: checkDate(values.date, 'Data'),
    description: checkText(values.description, 'Pole „Opis”', 255),
    category: checkText(values.category, 'Pole „Kategoria”', 100),
    amount: checkAmount(values.amount, 'Kwota'),
    type: ['INCOME', 'EXPENSE'].includes(values.type) ? undefined : 'Wybierz typ transakcji.',
  };
  if (!errors.date && values.date > today()) {
    errors.date = 'Data transakcji nie może być z przyszłości.';
  }
  return compact(errors);
}

export function validateBudget(values, existingCategories = []) {
  const errors = {
    category: checkText(values.category, 'Pole „Kategoria”', 100),
    limit: checkAmount(values.limit, 'Kwota limitu'),
  };
  const category = String(values.category ?? '').trim().toLowerCase();
  if (!errors.category && existingCategories.some((c) => c.toLowerCase() === category)) {
    errors.category = 'Budżet dla tej kategorii już istnieje.';
  }
  return compact(errors);
}

export function validateGoal(values) {
  const errors = {
    name: checkText(values.name, 'Pole „Nazwa celu”', 150),
    targetAmount: checkAmount(values.targetAmount, 'Kwota docelowa'),
    savedAmount: checkAmount(values.savedAmount, 'Odłożona kwota', { allowZero: true }),
    deadline: checkDate(values.deadline, 'Data realizacji'),
  };
  return compact(errors);
}
