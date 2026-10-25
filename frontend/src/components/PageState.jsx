function PageState({ loading, error, hasData, onRetry }) {
  if (loading && !hasData) {
    return (
      <div className="card shadow-sm placeholder-glow" aria-busy="true">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
            <span>Ładowanie danych z API…</span>
          </div>
          {[8, 6, 9, 5].map((width, index) => (
            <span key={index} className={`placeholder col-${width} d-block mb-2`} />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span>Nie udało się pobrać danych: {error}</span>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry} disabled={loading}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }
  return null;
}

export default PageState;
