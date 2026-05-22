import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services, categories } from '../api';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const [cats, setCats] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    categories.list().then(setCats).catch(() => {});
    services.list({ page: 1, limit: 8 }).then(setRecent).catch(() => {});
  }, []);

  return (
    <div>
      <div className="text-center py-10 px-4 rounded-3xl mb-6 text-white" style={{ background: 'linear-gradient(135deg, #1B6B3E 0%, #145230 100%)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px 0' }}>درب</h1>
        <p style={{ fontSize: 16, opacity: 0.9, margin: '0 0 24px 0' }}>كل واحد عنده درب — سوق الخدمات اليمني</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/register" className="btn-gold no-underline inline-block">ابدأ الآن</Link>
          <Link to="/search" className="btn-outline no-underline inline-block text-white border-white">تصفح الخدمات</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/add-service" className="card no-underline text-center py-6">
          <span style={{ fontSize: 32 }}>💼</span>
          <p className="m-0 mt-2 font-bold text-gray-800">أضف خدمتك</p>
        </Link>
        <Link to="/add-request" className="card no-underline text-center py-6">
          <span style={{ fontSize: 32 }}>📋</span>
          <p className="m-0 mt-2 font-bold text-gray-800">انشر طلب</p>
        </Link>
      </div>

      <h2 className="text-lg font-bold mb-3">التصنيفات</h2>
      <div style={{ overflowX: 'auto' }} className="flex gap-3 pb-3 mb-6">
        {cats.slice(0, 12).map((cat) => (
          <Link key={cat.id} to={`/search?category=${cat.id}`}
                style={{ minWidth: 100 }} className="card no-underline text-center py-4 flex-shrink-0">
            <span style={{ fontSize: 28, display: 'block' }}>{cat.icon}</span>
            <span className="text-xs font-bold text-gray-700 mt-1 block">{cat.name_ar}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold m-0">أحدث الخدمات</h2>
        <Link to="/search" className="text-sm text-[#1B6B3E] no-underline">عرض الكل</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {recent.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
}
