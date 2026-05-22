import { useState, useEffect } from 'react';
import { transactions } from '../api';

export default function TransactionsPage({ user }) {
  const [list, setList] = useState([]);

  useEffect(() => { transactions.list().then(setList).catch(() => {}); }, []);

  const handlePay = async (id) => {
    try { await transactions.pay(id); setList((prev) => prev.map((t) => t.id === id ? { ...t, status: 'in_progress' } : t)); }
    catch (err) { alert(err.response?.data?.error || 'خطأ'); }
  };

  const handleDeliver = async (id) => {
    try { await transactions.deliver(id); setList((prev) => prev.map((t) => t.id === id ? { ...t, provider_confirmed: 1 } : t)); }
    catch (err) { alert(err.response?.data?.error || 'خطأ'); }
  };

  const handleConfirm = async (id) => {
    try { await transactions.confirm(id); setList((prev) => prev.map((t) => t.id === id ? { ...t, status: 'completed', client_confirmed: 1 } : t)); }
    catch (err) { alert(err.response?.data?.error || 'خطأ'); }
  };

  const statusColors = {
    pending_payment: 'text-amber-600 bg-amber-50',
    in_progress: 'text-blue-600 bg-blue-50',
    completed: 'text-green-600 bg-green-50',
    disputed: 'text-red-600 bg-red-50',
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">صفقاتي</h1>
      {list.length === 0 ? (
        <p className="text-gray-400 text-center py-10">ما عندك صفقات</p>
      ) : (
        list.map((t) => (
          <div key={t.id} className="card mb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="m-0 font-bold">{t.request_title || t.service_title || `صفقة #${t.id.slice(0, 6)}`}</p>
                <p className="m-0 text-xs text-gray-500">
                  {t.client_id === user?.id ? `مع: ${t.provider_name}` : `مع: ${t.client_name}`}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg font-bold ${statusColors[t.status] || 'text-gray-600 bg-gray-50'}`}>
                {t.status === 'pending_payment' ? 'بانتظار الدفع' : t.status === 'in_progress' ? 'قيد التنفيذ' : t.status === 'completed' ? 'مكتملة' : t.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-[#1B6B3E] font-bold">{t.amount?.toLocaleString()} ريال</span>
              <div className="flex gap-2">
                {(t.status === 'pending_payment' || t.status === 'in_progress') && (
                  <a href={`/chat/${t.id}`} className="btn-outline text-sm no-underline">محادثة</a>
                )}
                {t.status === 'pending_payment' && t.client_id === user?.id && (
                  <button className="btn-gold text-sm" onClick={() => handlePay(t.id)}>دفع</button>
                )}
                {t.status === 'in_progress' && t.provider_id === user?.id && !t.provider_confirmed && (
                  <button className="btn-primary text-sm" onClick={() => handleDeliver(t.id)}>تسليم</button>
                )}
                {t.status === 'in_progress' && t.client_id === user?.id && t.provider_confirmed && !t.client_confirmed && (
                  <button className="btn-gold text-sm" onClick={() => handleConfirm(t.id)}>تأكيد الاستلام</button>
                )}
                {t.status === 'completed' && (
                  <a href={`/review/${t.id}?reviewee=${t.client_id === user?.id ? t.provider_id : t.client_id}`} className="btn-outline text-sm no-underline">تقييم</a>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
