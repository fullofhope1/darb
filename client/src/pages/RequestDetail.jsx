import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requests, offers } from '../api';

export default function RequestDetail({ user }) {
  const { id } = useParams();
  const [req, setReq] = useState(null);
  const [offersList, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [offerForm, setOfferForm] = useState({ price: '', duration: '', description: '' });
  const [loading, setLoading] = useState(false);

  const load = () => {
    requests.get(id).then(setReq).catch(() => {});
    offers.list(id).then(setOffers).catch(() => {});
  };
  useEffect(load, [id]);

  const submitOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await offers.create(id, { ...offerForm, price: parseFloat(offerForm.price), duration: parseInt(offerForm.duration) });
      setShowForm(false);
      setOfferForm({ price: '', duration: '', description: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (!req) return <p className="text-gray-400 text-center py-10">جاري التحميل...</p>;
  const isOwner = user?.id === req.user_id;
  const imgs = req.images || [];

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
        <h1 className="text-xl font-bold m-0 mb-2">{req.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>{req.category_name}</span><span>•</span>
          <span>{req.user_name}</span>
          {req.city && <><span>•</span><span>{req.city}</span></>}
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">{req.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#C6963D] font-bold">{req.budget_min?.toLocaleString()} - {req.budget_max?.toLocaleString()} ريال</span>
          <span className="text-gray-500">{req.duration} أيام</span>
          <span className={`px-2 py-1 rounded-lg text-xs ${req.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{req.status}</span>
        </div>
      </div>

      {!isOwner && req.status === 'open' && !showForm && (
        <button className="btn-gold w-full mb-4" onClick={() => setShowForm(true)}>تقديم عرض</button>
      )}

      {showForm && (
        <div className="card mb-4">
          <h3 className="font-bold mb-3">تقديم عرض</h3>
          <form onSubmit={submitOffer}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm font-bold block mb-1">السعر (ريال)</label>
                <input type="number" className="input-field" value={offerForm.price}
                  onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">المدة (أيام)</label>
                <input type="number" className="input-field" value={offerForm.duration}
                  onChange={(e) => setOfferForm({ ...offerForm, duration: e.target.value })} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-sm font-bold block mb-1">تفاصيل العرض</label>
              <textarea className="input-field" rows={3} value={offerForm.description}
                onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'جاري...' : 'إرسال العرض'}</button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Offers list */}
      <h2 className="text-lg font-bold mb-3">العروض ({offersList.length})</h2>
      {offersList.map((o) => (
        <div key={o.id} className="card mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1B6B3E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>
                {o.user_name?.[0]}
              </div>
              <div>
                <p className="m-0 font-bold text-sm">{o.user_name}</p>
                <p className="m-0 text-xs text-gray-500">{o.user_rating} ★</p>
              </div>
            </div>
            <div className="text-left">
              <p className="m-0 text-[#1B6B3E] font-bold">{o.price?.toLocaleString()} ريال</p>
              <p className="m-0 text-xs text-gray-500">{o.duration} أيام</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 m-0">{o.description}</p>
          {isOwner && o.status === 'pending' && (
            <Link to={`/offers/${o.id}/accept`} className="btn-primary text-sm mt-3 inline-block no-underline"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await offers.accept(o.id);
                  load();
                } catch (err) { alert(err.response?.data?.error || 'خطأ'); }
              }}>
              قبول العرض
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
