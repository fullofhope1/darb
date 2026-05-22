import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requests } from '../api';

export default function Requests() {
  const [list, setList] = useState([]);

  useEffect(() => { requests.my().then(setList).catch(() => {}); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold m-0">طلباتي</h1>
        <Link to="/add-request" className="btn-primary text-sm no-underline">نشر طلب</Link>
      </div>
      {list.length === 0 ? (
        <p className="text-gray-400 text-center py-10">ما عندك طلبات منشورة</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {list.map((r) => (
            <Link key={r.id} to={`/requests/${r.id}`} className="card block no-underline text-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="m-0 font-bold">{r.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  r.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>{r.status}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{r.offer_count || 0} عروض</span>
                <span>{r.city}</span>
                <span className="mr-auto">{r.budget_min?.toLocaleString()} - {r.budget_max?.toLocaleString()} ريال</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
