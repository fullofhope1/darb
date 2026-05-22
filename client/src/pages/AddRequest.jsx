import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requests, categories, upload } from '../api';

export default function AddRequest() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ category_id: '', title: '', description: '', budget_min: '', budget_max: '', duration: '', city: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { categories.list().then(setCats).catch(() => {}); }, []);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        const result = await upload.images(images);
        imageUrls = result.files;
      }
      const r = await requests.add({ ...form, budget_min: parseFloat(form.budget_min) || 0, budget_max: parseFloat(form.budget_max) || 0, duration: parseInt(form.duration) || 1, images: imageUrls });
      navigate(`/requests/${r.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1 className="text-xl font-bold mb-4">نشر طلب جديد</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">التصنيف</label>
          <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            <option value="">اختر تصنيف</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">عنوان الطلب</label>
          <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="مثلاً: أحتاج مبرمج يسوي موقع" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">التفاصيل</label>
          <textarea className="input-field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">صور توضيحية</label>
          <input type="file" accept="image/*" multiple onChange={handleImages} className="text-sm" />
          {previews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="" className="w-20 h-20 object-cover rounded-xl" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs cursor-pointer border-none">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="text-sm font-bold block mb-1">أقل ميزانية</label><input type="number" className="input-field" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} required /></div>
          <div><label className="text-sm font-bold block mb-1">أقصى ميزانية</label><input type="number" className="input-field" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} required /></div>
          <div><label className="text-sm font-bold block mb-1">المدة (أيام)</label><input type="number" className="input-field" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required /></div>
          <div><label className="text-sm font-bold block mb-1">المدينة</label><input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="صنعاء" /></div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'جاري النشر...' : 'نشر الطلب'}</button>
      </form>
    </div>
  );
}
