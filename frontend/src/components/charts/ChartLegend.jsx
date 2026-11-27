function ChartLegend({ items }) {
  return (
    <ul className="chart-legend list-unstyled d-flex flex-wrap gap-3 small mb-0">
      {items.map((item) => (
        <li key={item.label} className="d-flex align-items-center gap-2">
          <span className="legend-swatch" style={{ background: item.color }} aria-hidden="true" />
          <span className="text-body-secondary">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default ChartLegend;
