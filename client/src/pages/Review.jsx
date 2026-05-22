import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviews } from '../api';

export default function ReviewPage() {
  const { transactionId } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('اختر التقييم');
    setSaving(true);
    try {
      // We need reviewee_id - the transaction page should pass it via state or we can fetch the transaction
      const params = new URLSearchParams(window.location.search);
      const revieweeId = params.get('reviewee');
      if (!revieweeId) { alert('بيانات التقييم غير مكتملة'); return; }
      await reviews.create({ transaction_id: transactionId, reviewee_id: revieweeId, rating, comment });
      navigate('/transactions');
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 500, margin: '20px auto' }}>
      <h1 className="text-xl font-bold text-center mb-2">تقييم</h1>
      <p className="text-sm text-gray-500 text-center mb-6">قيّم تجربتك مع هذه الصفقة</p>

      <form onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <label className="block text-sm font-bold mb-2">التقييم</label>
          <div className="flex justify-center gap-1" style={{ direction: 'ltr' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                style={{ fontSize: 36, background: 'none', border: 'none', cursor: 'pointer', color: (hover || rating) >= star ? '#E8C97A' : '#ddd' }}>
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">تعليق (اختياري)</label>
          <textarea className="input-field" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="شارك تجربتك..." />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={saving || rating === 0}>
          {saving ? 'جاري...' : 'إرسال التقييم'}
        </button>
      </form>
    </div>
  );
}
