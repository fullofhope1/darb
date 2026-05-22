import Navbar from './Navbar';

export default function Layout({ children, user, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
        {children}
      </main>
    </div>
  );
}
