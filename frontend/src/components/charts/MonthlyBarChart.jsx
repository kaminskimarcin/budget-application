import { useState } from 'react';
import { compactCurrency, currency, formatMonth, formatShortMonth } from '../../utils/format';
import ChartLegend from './ChartLegend';

const WIDTH = 560;
const HEIGHT = 220;
const PADDING = { top: 12, right: 8, bottom: 28, left: 56 };
const BAR_GAP = 2;
const GRID_LINES = 4;

const SERIES = [
  { key: 'income', label: 'Przychody', color: 'var(--viz-income)' },
  { key: 'expenses', label: 'Wydatki', color: 'var(--viz-expense)' },
];

function niceMax(value) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function MonthlyBarChart({ data }) {
  const [active, setActive] = useState(null);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = niceMax(Math.max(...data.flatMap((d) => SERIES.map((s) => d[s.key]))));
  const slot = plotWidth / data.length;
  const barWidth = Math.min((slot * 0.6) / SERIES.length, 28);
  const y = (value) => PADDING.top + plotHeight - (value / maxValue) * plotHeight;
  const activeMonth = active === null ? null : data[active];

  return (
    <div className="position-relative">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <ChartLegend items={SERIES} />
        <div className="small text-body-secondary chart-readout" aria-live="polite">
          {activeMonth
            ? `${formatMonth(activeMonth.month)}: +${currency.format(activeMonth.income)} / −${currency.format(activeMonth.expenses)}`
            : 'Najedź na miesiąc, aby zobaczyć kwoty'}
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-100 chart-svg" role="img" aria-label="Przychody i wydatki w ostatnich miesiącach">
        {Array.from({ length: GRID_LINES + 1 }, (_, index) => {
          const value = (maxValue / GRID_LINES) * index;
          return (
            <g key={index}>
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y(value)} y2={y(value)} className="chart-grid" />
              <text x={PADDING.left - 8} y={y(value)} dy="0.32em" textAnchor="end" className="chart-axis">
                {compactCurrency.format(value)}
              </text>
            </g>
          );
        })}
        {data.map((month, index) => {
          const groupX = PADDING.left + slot * index + (slot - barWidth * SERIES.length - BAR_GAP) / 2;
          return (
            <g
              key={month.month}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className={active !== null && active !== index ? 'chart-dimmed' : ''}
            >
              <rect x={PADDING.left + slot * index} y={PADDING.top} width={slot} height={plotHeight} className="chart-hit" />
              {SERIES.map((series, seriesIndex) => {
                const value = month[series.key];
                const top = y(value);
                return (
                  <path
                    key={series.key}
                    d={roundedTopBar(groupX + seriesIndex * (barWidth + BAR_GAP), top, barWidth, y(0) - top)}
                    fill={series.color}
                  />
                );
              })}
              <text x={PADDING.left + slot * index + slot / 2} y={HEIGHT - 8} textAnchor="middle" className="chart-axis">
                {formatShortMonth(month.month)}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="visually-hidden">
        <caption>Przychody i wydatki w ostatnich miesiącach</caption>
        <thead>
          <tr>
            <th>Miesiąc</th>
            <th>Przychody</th>
            <th>Wydatki</th>
          </tr>
        </thead>
        <tbody>
          {data.map((month) => (
            <tr key={month.month}>
              <td>{formatMonth(month.month)}</td>
              <td>{currency.format(month.income)}</td>
              <td>{currency.format(month.expenses)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function roundedTopBar(x, top, width, height) {
  if (height <= 0) return '';
  const radius = Math.min(4, width / 2, height);
  return [
    `M${x},${top + height}`,
    `V${top + radius}`,
    `Q${x},${top} ${x + radius},${top}`,
    `H${x + width - radius}`,
    `Q${x + width},${top} ${x + width},${top + radius}`,
    `V${top + height}`,
    'Z',
  ].join(' ');
}

export default MonthlyBarChart;
