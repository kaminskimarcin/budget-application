function PageState({ loading, error }) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="spinner-border spinner-border-sm text-primary" role="status" />
        <span>Ładowanie…</span>
      </div>
    );
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  return null;
}

export default PageState;
