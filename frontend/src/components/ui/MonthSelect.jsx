import { formatMonth } from '../../utils/format';

function MonthSelect({ months, value, onChange, id = 'month-select' }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor={id} className="small text-body-secondary text-nowrap mb-0">
        Miesiąc
      </label>
      <select id={id} className="form-select form-select-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonth(month)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthSelect;
