const COLORED_VALUE_TONES = ['success', 'danger'];

function StatCard({ label, value, hint, tone = 'primary', icon }) {
  const valueTone = COLORED_VALUE_TONES.includes(tone) ? tone : 'body';

  return (
    <div className="card stat-card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <span className="text-body-secondary small text-uppercase fw-semibold stat-label">{label}</span>
          {icon && (
            <span className={`stat-icon text-${tone}-emphasis bg-${tone}-subtle`} aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
        <div className={`fs-4 fw-bold mt-1 text-${valueTone}`}>{value}</div>
        {hint && <div className="small text-body-secondary mt-1">{hint}</div>}
      </div>
    </div>
  );
}

export default StatCard;
