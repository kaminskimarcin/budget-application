function FormCard({ title, children }) {
  return (
    <div className="card shadow-sm mb-4 border-primary-subtle">
      <div className="card-header bg-primary-subtle fw-semibold">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default FormCard;
