function PageHeader({ title, refreshing, children }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div className="d-flex align-items-center gap-2">
        <h2 className="h4 mb-0">{title}</h2>
        {refreshing && <span className="spinner-border spinner-border-sm text-primary" role="status" />}
      </div>
      <div className="d-flex gap-2">{children}</div>
    </div>
  );
}

export default PageHeader;
