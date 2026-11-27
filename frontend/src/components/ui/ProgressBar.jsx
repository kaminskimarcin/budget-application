function ProgressBar({ value, tone = 'primary', label, height = '0.6rem', showValue = false }) {
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className="progress progress-soft"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
      style={{ height }}
    >
      <div className={`progress-bar bg-${tone}`} style={{ width: `${width}%` }}>
        {showValue && `${value}%`}
      </div>
    </div>
  );
}

export default ProgressBar;
