import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.register({ name, phone, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      // Send OTP for verification
      try { await auth.sendOtp(phone); } catch {}
      navigate(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <div className="card">
        <h1 className="text-2xl font-bold text-center mb-2">حساب جديد</h1>
        <p className="text-sm text-gray-500 text-center mb-6">أنشئ حسابك في درب</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">الاسم</label>
            <input type="text" className="input-field" placeholder="الاسم ثلاثي" value={name}
                   onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">رقم الجوال</label>
            <input type="tel" className="input-field" placeholder="77XXXXXXX" value={phone}
                   onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">كلمة السر</label>
            <input type="password" className="input-field" value={password}
                   onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'جاري...' : 'تسجيل'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          عندك حساب؟ <Link to="/login" className="text-[#1B6B3E] font-bold">دخول</Link>
        </p>
      </div>
    </div>
  );
}
