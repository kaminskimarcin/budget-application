function FormField({ label, name, error, className = 'col-12', as = 'input', children, ...props }) {
  const Control = as;
  const controlClass = as === 'select' ? 'form-select' : 'form-control';

  return (
    <div className={className}>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <Control
        id={name}
        name={name}
        className={`${controlClass} ${error ? 'is-invalid' : ''}`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </Control>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default FormField;
