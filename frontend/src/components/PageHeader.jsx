import { dataSource } from '../api/transactionsApi';

function PageHeader({ title }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <h2 className="h4 mb-0">{title}</h2>
      <span className="badge rounded-pill text-bg-info">
        Źródło danych: {dataSource === 'mock' ? 'dane makietowe' : 'API'}
      </span>
    </div>
  );
}

export default PageHeader;
