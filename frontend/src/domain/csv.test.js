import { describe, expect, it } from 'vitest';
import { toCsv } from './csv';

describe('toCsv', () => {
  it('buduje nagłówek i wiersze rozdzielone średnikiem', () => {
    const columns = [
      { label: 'Opis', value: (row) => row.name },
      { label: 'Kwota', value: (row) => row.amount },
    ];
    expect(toCsv(columns, [{ name: 'Kino', amount: '-58,00' }])).toBe('Opis;Kwota\nKino;-58,00');
  });

  it('cytuje komórki ze średnikiem i cudzysłowem', () => {
    const columns = [{ label: 'Opis', value: (row) => row.name }];
    expect(toCsv(columns, [{ name: 'Zakupy; "Lidl"' }])).toBe('Opis\n"Zakupy; ""Lidl"""');
  });
});
