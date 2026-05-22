import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notifications } from '../api';

export default function Navbar({ user, onLogout }) {
  const [menu, setMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const navigate = useNavigate();
  const notifRef = useRef();

  useEffect(() => {
    if (!user) return;
    notifications.list().then(setNotifs).catch(() => {});
    const interval = setInterval(() => {
      notifications.list().then(setNotifs).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unread = notifs.filter((n) => !n.is_read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markRead = async (id) => {
    await notifications.markRead(id).catch(() => {});
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAll = async () => {
    await notifications.markAllRead().catch(() => {});
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <nav style={{ background: '#1B6B3E' }} className="text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <Link to="/" className="flex items-center gap-2 no-underline text-white">
        <span style={{ fontFamily: 'Tajawal', fontWeight: 800, fontSize: 24 }}>درب</span>
        <span style={{ fontSize: 12, opacity: 0.8 }}>كل واحد عنده درب</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/search" className="text-white/80 no-underline text-sm hidden md:block">تصفح</Link>

        {user && (
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative bg-white/20 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer border-none text-white">
              🔔
              {unread > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', fontSize: 10, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl text-gray-800 min-w-[280px] max-h-[400px] overflow-y-auto z-50" style={{ direction: 'rtl' }}>
                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                  <span className="font-bold text-sm">الإشعارات</span>
                  {unread > 0 && <button onClick={markAll} className="text-xs text-[#1B6B3E] cursor-pointer border-none bg-transparent font-bold">قراءة الكل</button>}
                </div>
                {notifs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">ما في إشعارات</p>
                ) : (
                  notifs.slice(0, 20).map((n) => (
                    <div key={n.id} onClick={() => markRead(n.id)} className={`px-3 py-3 border-b border-gray-50 cursor-pointer ${!n.is_read ? 'bg-[#1B6B3E]/5' : ''}`}>
                      <p className="m-0 text-sm font-bold">{n.title}</p>
                      <p className="m-0 text-xs text-gray-500">{n.body}</p>
                      <p className="m-0 text-xs text-gray-400 mt-1">{n.created_at}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <div className="relative">
            <button onClick={() => setMenu(!menu)} className="bg-white/20 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer border-none text-white font-bold text-sm">
              {user.name?.[0] || 'U'}
            </button>
            {menu && (
              <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl text-gray-800 min-w-[180px] py-2 z-50" style={{ direction: 'rtl' }}>
                <Link to="/profile" className="block px-4 py-2 no-underline text-gray-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>
                  {user.name}
                </Link>
                <Link to="/services/my" className="block px-4 py-2 no-underline text-gray-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>خدماتي</Link>
                <Link to="/requests/my" className="block px-4 py-2 no-underline text-gray-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>طلباتي</Link>
                <Link to="/transactions" className="block px-4 py-2 no-underline text-gray-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>صفقاتي</Link>
                <Link to="/wallet" className="block px-4 py-2 no-underline text-gray-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>المحفظة</Link>
                <hr className="my-1 border-gray-100" />
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 no-underline text-amber-700 hover:bg-gray-50 text-sm" onClick={() => setMenu(false)}>لوحة التحكم</Link>
                )}
                <button onClick={() => { setMenu(false); onLogout(); }} className="w-full text-right px-4 py-2 text-red-600 hover:bg-gray-50 text-sm cursor-pointer border-none bg-transparent">
                  تسجيل خروج
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => navigate('/login')} className="text-sm px-4 py-2 rounded-xl border border-white/40 text-white cursor-pointer bg-transparent">
              دخول
            </button>
            <button onClick={() => navigate('/register')} className="text-sm px-4 py-2 rounded-xl bg-white text-[#1B6B3E] font-bold cursor-pointer border-none">
              تسجيل
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
