function EmptyState({ icon = '📭', title, children }) {
  return (
    <div className="card empty-state text-center">
      <div className="card-body py-5">
        <div className="display-6 mb-2" aria-hidden="true">
          {icon}
        </div>
        <h3 className="h6 mb-1">{title}</h3>
        {children && <div className="text-body-secondary small">{children}</div>}
      </div>
    </div>
  );
}

export default EmptyState;
