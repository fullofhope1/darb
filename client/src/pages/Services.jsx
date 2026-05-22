import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../api';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const [list, setList] = useState([]);

  useEffect(() => {
    services.list({}).then(setList).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold m-0">خدماتي</h1>
        <Link to="/add-service" className="btn-primary text-sm no-underline">إضافة خدمة</Link>
      </div>
      {list.length === 0 ? (
        <p className="text-gray-400 text-center py-10">ما عندك خدمات منشورة بعد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((s) => (
            <div key={s.id} className="card">
              <h3 className="m-0 font-bold">{s.title}</h3>
              <p className="text-sm text-gray-500 my-2">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#1B6B3E] font-bold">{s.price?.toLocaleString()} ريال</span>
                <div className="flex gap-2">
                  <Link to={`/services/${s.id}`} className="text-sm text-[#1B6B3E]">عرض</Link>
                  <Link to={`/edit-service/${s.id}`} className="text-sm text-gray-500">تعديل</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
