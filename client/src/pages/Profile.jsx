import { useState } from 'react';
import { auth } from '../api';

export default function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await auth.updateProfile({ name });
      localStorage.setItem('user', JSON.stringify(updated));
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 500, margin: '20px auto' }}>
      <div className="text-center mb-6">
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1B6B3E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, color: 'white', fontWeight: 800 }}>
          {user?.name?.[0] || 'U'}
        </div>
        <h1 className="text-xl font-bold m-0">{user?.name}</h1>
        <p className="text-sm text-gray-500 m-0">{user?.phone}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-lg font-bold text-[#1B6B3E]">{user?.rating || 0}</div>
          <div className="text-xs text-gray-500">التقييم</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-lg font-bold text-[#1B6B3E]">{user?.completed_orders || 0}</div>
          <div className="text-xs text-gray-500">الصفقات</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-lg font-bold text-[#1B6B3E]">{user?.city || '-'}</div>
          <div className="text-xs text-gray-500">المدينة</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">الاسم</label>
        <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button className="btn-primary w-full" onClick={handleSave} disabled={saving}>
        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
      </button>
    </div>
  );
}
