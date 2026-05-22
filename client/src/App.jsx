import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import AddService from './pages/AddService';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import AddRequest from './pages/AddRequest';
import TransactionsPage from './pages/Transactions';
import WalletPage from './pages/Wallet';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import ReviewPage from './pages/Review';
import Chat from './pages/Chat';
import VerifyOTP from './pages/VerifyOTP';

function PrivateRoute({ children, user }) {
  return user ? children : <Navigate to="/login" />;
}

function VerifyOTPWrapper({ user }) {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || user?.phone;
  return <VerifyOTP phone={phone} onVerified={() => {}} />;
}

function AdminRoute({ children, user }) {
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/verify-otp" element={<PrivateRoute user={user}><VerifyOTPWrapper user={user} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute user={user}><Profile user={user} onUpdate={setUser} /></PrivateRoute>} />
          <Route path="/search" element={<Search />} />
          <Route path="/services/my" element={<PrivateRoute user={user}><Services /></PrivateRoute>} />
          <Route path="/services/:id" element={<ServiceDetail user={user} />} />
          <Route path="/add-service" element={<PrivateRoute user={user}><AddService /></PrivateRoute>} />
          <Route path="/requests/my" element={<PrivateRoute user={user}><Requests /></PrivateRoute>} />
          <Route path="/requests/:id" element={<RequestDetail user={user} />} />
          <Route path="/add-request" element={<PrivateRoute user={user}><AddRequest /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute user={user}><TransactionsPage user={user} /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute user={user}><WalletPage /></PrivateRoute>} />
          <Route path="/chat/:transactionId" element={<PrivateRoute user={user}><Chat user={user} /></PrivateRoute>} />
          <Route path="/review/:transactionId" element={<PrivateRoute user={user}><ReviewPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute user={user}><AdminDashboard /></AdminRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
