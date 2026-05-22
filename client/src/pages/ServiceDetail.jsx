import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { services } from '../api';

export default function ServiceDetail({ user }) {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => { services.get(id).then(setService).catch(() => {}); }, [id]);

  if (!service) return <p className="text-gray-400 text-center py-10">جاري التحميل...</p>;
  const imgs = service.images || [];

  return (
    <div style={{ maxWidth: 700, margin: '20px auto' }}>
      <div className="card mb-4">
        {imgs.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {imgs.map((img, i) => (
              <img key={i} src={img} alt="" className="h-48 rounded-xl object-cover" style={{ minWidth: 300 }} />
            ))}
          </div>
        )}
        <h1 className="text-xl font-bold m-0 mb-2">{service.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>{service.category_name}</span>
          <span>•</span>
          <span>{service.user_name}</span>
          {service.city && <><span>•</span><span>{service.city}</span></>}
        </div>
        <p className="text-gray-700 leading-relaxed">{service.description}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-[#1B6B3E]">{service.price?.toLocaleString()} ريال</span>
          {user && user.id !== service.user_id && (
            <button className="btn-gold" onClick={() => alert('سيتم إضافة التواصل مع صاحب الخدمة قريباً')}>
              طلب الخدمة
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-2">عن مقدم الخدمة</h3>
        <div className="flex items-center gap-3">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1B6B3E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
            {service.user_name?.[0]}
          </div>
          <div>
            <p className="font-bold m-0">{service.user_name}</p>
            <p className="text-xs text-gray-500 m-0">
              {service.user_rating} ★ • {service.completed_orders || 0} صفقات
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
