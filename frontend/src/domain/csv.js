const SEPARATOR = ';';

function escapeCell(value) {
  const text = String(value ?? '');
  return /[";\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.label)).join(SEPARATOR);
  const lines = rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(SEPARATOR));
  return [header, ...lines].join('\n');
}

export function downloadCsv(fileName, content) {
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
