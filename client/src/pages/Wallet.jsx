import { useState, useEffect } from 'react';
import { wallet } from '../api';

export default function WalletPage() {
  const [data, setData] = useState(null);
  const [wtxn, setWtxn] = useState([]);
  const [wd, setWd] = useState([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [wForm, setWForm] = useState({ amount: '', wallet_type: 'karimi', wallet_number: '', wallet_name: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    wallet.get().then(setData).catch(() => {});
    wallet.transactions().then(setWtxn).catch(() => {});
    wallet.withdrawals().then(setWd).catch(() => {});
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await wallet.withdraw({ ...wForm, amount: parseFloat(wForm.amount) });
      setShowWithdraw(false);
      setWForm({ amount: '', wallet_type: 'karimi', wallet_number: '', wallet_name: '' });
      wallet.get().then(setData).catch(() => {});
      wallet.withdrawals().then(setWd).catch(() => {});
    } catch (err) {
      alert(err.response?.data?.error || 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  const walletTypes = { karimi: 'كريمي', jeeb: 'جيب', onecash: 'ون كاش', govali: 'جوال ي' };

  return (
    <div>
      {/* Balance */}
      <div className="card text-center mb-4" style={{ background: 'linear-gradient(135deg, #1B6B3E, #145230)', color: 'white', border: 'none' }}>
        <p className="text-sm opacity-80 m-0 mb-1">الرصيد الحالي</p>
        <p style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px 0' }}>{data?.balance?.toLocaleString() || 0} ريال</p>
        <button className="btn-gold text-sm" onClick={() => setShowWithdraw(!showWithdraw)}>سحب</button>
      </div>

      {showWithdraw && (
        <div className="card mb-4">
          <h3 className="font-bold mb-3">طلب سحب</h3>
          <form onSubmit={handleWithdraw}>
            <div className="mb-3">
              <label className="text-sm font-bold block mb-1">المبلغ (ريال)</label>
              <input type="number" className="input-field" value={wForm.amount}
                onChange={(e) => setWForm({ ...wForm, amount: e.target.value })} required max={data?.balance} />
            </div>
            <div className="mb-3">
              <label className="text-sm font-bold block mb-1">المحفظة</label>
              <select className="input-field" value={wForm.wallet_type} onChange={(e) => setWForm({ ...wForm, wallet_type: e.target.value })}>
                {Object.entries(walletTypes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="text-sm font-bold block mb-1">رقم المحفظة</label>
              <input className="input-field" value={wForm.wallet_number} onChange={(e) => setWForm({ ...wForm, wallet_number: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="text-sm font-bold block mb-1">اسم صاحب المحفظة</label>
              <input className="input-field" value={wForm.wallet_name} onChange={(e) => setWForm({ ...wForm, wallet_name: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'جاري...' : 'طلب سحب'}</button>
              <button type="button" className="btn-outline" onClick={() => setShowWithdraw(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawals */}
      {wd.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-3">طلبات السحب</h2>
          {wd.map((w) => (
            <div key={w.id} className="card mb-2 flex items-center justify-between">
              <div>
                <span className="font-bold">{w.amount?.toLocaleString()} ريال</span>
                <span className="text-xs text-gray-500 mr-2">→ {walletTypes[w.wallet_type]}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${
                w.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
              }`}>{w.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Transactions log */}
      <h2 className="font-bold mb-3">حركات المحفظة</h2>
      {wtxn.map((t) => (
        <div key={t.id} className="card mb-2 flex items-center justify-between text-sm">
          <div>
            <span className="font-bold">{t.description}</span>
            <p className="text-xs text-gray-500 m-0">{t.created_at}</p>
          </div>
          <span className={`font-bold ${t.type === 'payment_release' || t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
            {t.type === 'payment_release' || t.type === 'deposit' ? '+' : '-'}{t.amount?.toLocaleString()} ريال
          </span>
        </div>
      ))}
    </div>
  );
}
