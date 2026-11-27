function PageHeader({ title, subtitle, refreshing, children }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <div className="d-flex align-items-center gap-2">
          <h1 className="h3 fw-bold mb-0">{title}</h1>
          {refreshing && <span className="spinner-border spinner-border-sm text-primary" role="status" />}
        </div>
        {subtitle && <p className="text-body-secondary mb-0 small">{subtitle}</p>}
      </div>
      <div className="d-flex flex-wrap gap-2 align-items-center">{children}</div>
    </div>
  );
}

export default PageHeader;
