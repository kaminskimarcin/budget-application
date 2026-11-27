function Panel({ title, action, children }) {
  return (
    <div className="card h-100">
      <div className="card-header bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
        <h2 className="h6 fw-semibold mb-0">{title}</h2>
        {action}
      </div>
      <div className="card-body pt-2">{children}</div>
    </div>
  );
}

export default Panel;
