import { useState, useEffect } from 'react';
import { admin } from '../api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [dash, setDash] = useState(null);
  const [users, setUsers] = useState([]);
  const [txns, setTxns] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    admin.dashboard().then(setDash).catch(() => {});
    admin.users().then(setUsers).catch(() => {});
    admin.transactions().then(setTxns).catch(() => {});
    admin.withdrawals().then(setWithdrawals).catch(() => {});
    admin.disputes().then(setDisputes).catch(() => {});
  }, []);

  const approveWithdrawal = async (id, status) => {
    try {
      await admin.updateWithdrawal(id, { status, notes: status === 'approved' ? 'تمت الموافقة' : 'مرفوض' });
      admin.withdrawals().then(setWithdrawals).catch(() => {});
    } catch (err) { alert('خطأ'); }
  };

  const resolveDispute = async (id, resolution) => {
    try {
      await admin.resolveDispute(id, { resolution, resolution_notes: `تم الحل: ${resolution}` });
      admin.disputes().then(setDisputes).catch(() => {});
    } catch (err) { alert('خطأ'); }
  };

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية' },
    { id: 'users', label: 'المستخدمين' },
    { id: 'transactions', label: 'الصفقات' },
    { id: 'withdrawals', label: 'السحوبات' },
    { id: 'disputes', label: 'النزاعات' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">لوحة التحكم</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer border-none whitespace-nowrap ${
              tab === t.id ? 'bg-[#1B6B3E] text-white' : 'bg-white text-gray-600'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && dash && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="المستخدمين" value={dash.total_users} />
          <StatBox label="الخدمات" value={dash.active_services} />
          <StatBox label="الطلبات" value={dash.open_requests} />
          <StatBox label="الصفقات" value={dash.completed_transactions} />
          <StatBox label="الإيرادات" value={`${dash.total_revenue?.toLocaleString()} ريال`} />
          <StatBox label="النزاعات" value={dash.open_disputes} warn={dash.open_disputes > 0} />
          <StatBox label="سحوبات معلقة" value={dash.pending_withdrawals} warn={dash.pending_withdrawals > 0} />
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-right">الاسم</th>
                <th className="p-2 text-right">الجوال</th>
                <th className="p-2 text-right">الدور</th>
                <th className="p-2 text-right">الحالة</th>
                <th className="p-2 text-right">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2 text-gray-500">{u.phone}</td>
                  <td className="p-2">{u.role === 'admin' ? 'مدير' : 'مستخدم'}</td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-2">{u.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-right">العميل</th>
                <th className="p-2 text-right">مقدم الخدمة</th>
                <th className="p-2 text-right">المبلغ</th>
                <th className="p-2 text-right">الحالة</th>
                <th className="p-2 text-right">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="p-2">{t.client_name}</td>
                  <td className="p-2">{t.provider_name}</td>
                  <td className="p-2 font-bold">{t.amount?.toLocaleString()} ريال</td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      t.status === 'completed' ? 'bg-green-50 text-green-600' :
                      t.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>{t.status}</span>
                  </td>
                  <td className="p-2 text-gray-500">{t.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Withdrawals */}
      {tab === 'withdrawals' && (
        <div>
          {withdrawals.length === 0 ? (
            <p className="text-gray-400 text-center py-10">ما في سحوبات معلقة</p>
          ) : (
            withdrawals.map((w) => (
              <div key={w.id} className="card mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="m-0 font-bold">{w.user_name}</p>
                    <p className="m-0 text-sm text-gray-500">{w.wallet_type} - {w.wallet_number}</p>
                  </div>
                  <span className="font-bold text-lg">{w.amount?.toLocaleString()} ريال</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary text-sm" onClick={() => approveWithdrawal(w.id, 'approved')}>موافقة</button>
                  <button className="btn-outline text-sm" onClick={() => approveWithdrawal(w.id, 'rejected')}>رفض</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Disputes */}
      {tab === 'disputes' && (
        <div>
          {disputes.length === 0 ? (
            <p className="text-gray-400 text-center py-10">ما في نزاعات</p>
          ) : (
            disputes.map((d) => (
              <div key={d.id} className="card mb-3">
                <div className="mb-2">
                  <p className="m-0 font-bold">نزاع على صفقة</p>
                  <p className="m-0 text-sm text-gray-500">المبلغ: {d.amount?.toLocaleString()} ريال</p>
                  <p className="m-0 text-sm text-gray-500">السبب: {d.reason}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="btn-primary text-sm" onClick={() => resolveDispute(d.id, 'full_to_provider')}>لصاحب المهارة</button>
                  <button className="btn-outline text-sm" onClick={() => resolveDispute(d.id, 'full_to_client')}>للعميل</button>
                  <button className="btn-gold text-sm" onClick={() => resolveDispute(d.id, 'partial')}>نصفين</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, warn }) {
  return (
    <div className="card text-center">
      <p className="text-sm text-gray-500 m-0">{label}</p>
      <p className={`text-2xl font-bold m-0 ${warn ? 'text-red-600' : 'text-[#1B6B3E]'}`}>{value}</p>
    </div>
  );
}
