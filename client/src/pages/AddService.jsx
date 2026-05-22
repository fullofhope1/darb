import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, categories, upload } from '../api';

export default function AddService() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ category_id: '', title: '', description: '', price: '', city: '' });
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
      const s = await services.add({ ...form, price: parseFloat(form.price) || 0, images: imageUrls });
      navigate(`/services/${s.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1 className="text-xl font-bold mb-4">إضافة خدمة جديدة</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">التصنيف</label>
          <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            <option value="">اختر تصنيف</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">عنوان الخدمة</label>
          <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="مثلاً: تصميم شعار احترافي" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">الوصف</label>
          <textarea className="input-field" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">السعر (ريال)</label>
            <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">المدينة</label>
            <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="صنعاء" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">صور الخدمة</label>
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

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'جاري النشر...' : 'نشر الخدمة'}
        </button>
      </form>
    </div>
  );
}
