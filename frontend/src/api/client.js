const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(status, message, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors ?? {};
  }
}

function fallbackMessage(status) {
  if (status >= 502 && status <= 504) return 'Serwer API jest niedostępny. Spróbuj ponownie za chwilę.';
  if (status >= 500) return 'Wewnętrzny błąd serwera.';
  if (status === 404) return 'Nie znaleziono zasobu.';
  return `Błąd API: ${status}`;
}

async function request(method, path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Brak połączenia z serwerem API.');
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, data?.message ?? fallbackMessage(response.status), data?.fieldErrors);
  }
  return data;
}

function resource(path) {
  return {
    list: () => request('GET', path),
    create: (body) => request('POST', path, body),
    update: (id, body) => request('PUT', `${path}/${id}`, body),
    remove: (id) => request('DELETE', `${path}/${id}`),
  };
}

export const transactionsApi = resource('/transactions');
export const budgetsApi = resource('/budgets');
export const goalsApi = resource('/goals');
