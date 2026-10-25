function FormActions({ saving, editing, onCancel }) {
  return (
    <div className="col-12 d-flex gap-2 justify-content-end">
      <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>
        Anuluj
      </button>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
        {saving ? 'Zapisywanie…' : editing ? 'Zapisz zmiany' : 'Dodaj'}
      </button>
    </div>
  );
}

export default FormActions;
