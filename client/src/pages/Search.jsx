import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { search, categories } from '../api';
import ServiceCard from '../components/ServiceCard';
import RequestCard from '../components/RequestCard';

export default function Search() {
  const [params] = useSearchParams();
  const [results, setResults] = useState({ services: [], requests: [] });
  const [cats, setCats] = useState([]);
  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    category: params.get('category') || '',
    city: params.get('city') || '',
    type: 'all',
  });

  useEffect(() => { categories.list().then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    const p = {};
    if (filters.q) p.q = filters.q;
    if (filters.category) p.category = filters.category;
    if (filters.city) p.city = filters.city;
    if (filters.type !== 'all') p.type = filters.type;
    search.all(p).then(setResults).catch(() => {});
  }, [filters]);

  return (
    <div>
      {/* Search bar */}
      <div className="card mb-4">
        <div className="flex gap-2 mb-3">
          <input className="input-field flex-1" placeholder="ابحث عن خدمة أو طلب..."
            value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          <button className="btn-primary">بحث</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className="input-field text-sm flex-1" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">كل التصنيفات</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
          </select>
          <input className="input-field text-sm flex-1" placeholder="المدينة" value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <select className="input-field text-sm" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="all">الكل</option>
            <option value="services">خدمات</option>
            <option value="requests">طلبات</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {results.services.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">الخدمات ({results.services.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {results.services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      )}

      {results.requests.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">الطلبات ({results.requests.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {results.requests.map((r) => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>
      )}

      {results.services.length === 0 && results.requests.length === 0 && (
        <p className="text-gray-400 text-center py-10">لا توجد نتائج</p>
      )}
    </div>
  );
}
