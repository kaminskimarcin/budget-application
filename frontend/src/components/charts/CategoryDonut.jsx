import { useState } from 'react';
import { currency, percent } from '../../utils/format';

const SIZE = 150;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

const colorFor = (index, isOther) => (isOther ? 'var(--viz-other)' : `var(--viz-${index + 1})`);

function CategoryDonut({ data, otherLabel }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data.reduce((acc, item, index) => {
    const offset = acc.length ? acc.at(-1).offset + acc.at(-1).length : 0;
    const length = (item.value / total) * CIRCUMFERENCE;
    return [...acc, { ...item, offset, length, color: colorFor(index, item.category === otherLabel) }];
  }, []);
  const focused = active === null ? null : segments[active];

  return (
    <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
      <div className="donut position-relative flex-shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label="Struktura wydatków według kategorii">
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            {segments.map((segment, index) => (
              <circle
                key={segment.category}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={active === index ? STROKE + 4 : STROKE}
                strokeDasharray={`${Math.max(segment.length - GAP, 0.5)} ${CIRCUMFERENCE}`}
                strokeDashoffset={-segment.offset}
                className={active !== null && active !== index ? 'chart-dimmed' : ''}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </g>
        </svg>
        <div className="donut-center text-center">
          <div className="small text-body-secondary">{focused ? focused.category : 'Razem'}</div>
          <div className="fw-bold">{currency.format(focused ? focused.value : total)}</div>
        </div>
      </div>
      <ul className="list-unstyled flex-grow-1 min-w-0 align-self-stretch mb-0 small">
        {segments.map((segment, index) => (
          <li
            key={segment.category}
            className={`d-flex align-items-center gap-2 py-1 legend-row ${active === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="legend-swatch" style={{ background: segment.color }} aria-hidden="true" />
            <span className="flex-grow-1 text-truncate">{segment.category}</span>
            <span className="text-body-secondary">{percent(segment.value, total)}%</span>
            <span className="fw-semibold text-end amount-col">{currency.format(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryDonut;
