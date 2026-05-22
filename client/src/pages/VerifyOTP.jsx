import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api';

export default function VerifyOTP({ phone, onVerified }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    // Show dev code if available (no SMS provider configured)
    if (window.__devCode) {
      setCode(window.__devCode);
      window.__devCode = null;
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await auth.verifyOtp(phone, code);
      onVerified();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'كود خاطئ');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setCountdown(60);
    try {
      await auth.sendOtp(phone);
    } catch { }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '60px auto' }}>
      <h1 className="text-2xl font-bold text-center mb-2">تأكيد رقم الجوال</h1>
      <p className="text-sm text-gray-500 text-center mb-6">أدخل الكود المرسل إلى {phone}</p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}
      {code && <div className="bg-amber-50 text-amber-700 p-2 rounded-xl text-xs mb-3 text-center">تم تعبئة الكود تلقائياً (وضع تجريبي)</div>}

      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-center">كود التأكيد</label>
          <input type="text" className="input-field text-center text-2xl tracking-widest" maxLength={6}
            value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="_ _ _ _ _ _" required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading || code.length < 6}>
          {loading ? 'جاري...' : 'تأكيد'}
        </button>
      </form>

      <div className="text-center mt-4">
        {countdown > 0 ? (
          <span className="text-sm text-gray-500">أعد الإرسال بعد {countdown} ثانية</span>
        ) : (
          <button onClick={resend} className="text-sm text-[#1B6B3E] font-bold cursor-pointer border-none bg-transparent">
            إعادة إرسال الكود
          </button>
        )}
      </div>
    </div>
  );
}
