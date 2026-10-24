import mockTransactions from '../mocks/transactions.json';
import mockBudgets from '../mocks/budgets.json';
import mockGoals from '../mocks/goals.json';

// Adres API i tryb pracy pochodzą wyłącznie ze zmiennych środowiskowych (.env.local / build args).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

async function get(path, mockData) {
  if (USE_MOCK) {
    return Promise.resolve(mockData);
  }

  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Błąd API: ${response.status}`);
  }
  return response.json();
}

export const getTransactions = () => get('/transactions', mockTransactions);
export const getBudgets = () => get('/budgets', mockBudgets);
export const getGoals = () => get('/goals', mockGoals);

export const dataSource = USE_MOCK ? 'mock' : 'api';
