import { EMPTY_QUERY, SORT_OPTIONS, isFiltered } from '../domain/transactionQuery';

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'Wszystkie' },
  { value: 'INCOME', label: 'Przychody' },
  { value: 'EXPENSE', label: 'Wydatki' },
];

function TransactionFilters({ query, categories, onChange, resultCount, totalCount }) {
  const update = (event) => onChange({ ...query, [event.target.name]: event.target.value });

  return (
    <div className="card filter-card mb-3">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-lg-4">
            <label htmlFor="filter-search" className="form-label small text-body-secondary mb-1">
              Szukaj
            </label>
            <input
              id="filter-search"
              name="search"
              type="search"
              className="form-control"
              placeholder="Opis lub kategoria…"
              value={query.search}
              onChange={update}
            />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="filter-category" className="form-label small text-body-secondary mb-1">
              Kategoria
            </label>
            <select id="filter-category" name="category" className="form-select" value={query.category} onChange={update}>
              <option value="">Wszystkie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="filter-from" className="form-label small text-body-secondary mb-1">
              Od
            </label>
            <input id="filter-from" name="from" type="date" className="form-control" value={query.from} max={query.to || undefined} onChange={update} />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="filter-to" className="form-label small text-body-secondary mb-1">
              Do
            </label>
            <input id="filter-to" name="to" type="date" className="form-control" value={query.to} min={query.from || undefined} onChange={update} />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="filter-sort" className="form-label small text-body-secondary mb-1">
              Sortuj
            </label>
            <select id="filter-sort" name="sort" className="form-select" value={query.sort} onChange={update}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
          <div className="btn-group btn-group-sm" role="group" aria-label="Typ transakcji">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                name="type"
                value={option.value}
                className={`btn ${query.type === option.value ? 'btn-primary' : 'btn-outline-primary'}`}
                aria-pressed={query.type === option.value}
                onClick={update}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2 small text-body-secondary">
            <span>
              Wyniki: <strong className="text-body">{resultCount}</strong> z {totalCount}
            </span>
            {isFiltered(query) && (
              <button type="button" className="btn btn-sm btn-link p-0" onClick={() => onChange({ ...EMPTY_QUERY, sort: query.sort })}>
                Wyczyść filtry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionFilters;
