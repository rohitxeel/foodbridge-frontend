import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import IndividualDashboard from './pages/IndividualDashboard';
import BanquetDashboard from './pages/BanquetDashboard';
import PublicDashboard from './pages/PublicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'individual') return <Navigate to="/dashboard/individual" replace />;
  if (user.role === 'banquet')    return <Navigate to="/dashboard/banquet"    replace />;
  if (user.role === 'public')     return <Navigate to="/dashboard/public"     replace />;
  if (user.role === 'admin')      return <Navigate to="/admin-dashboard"      replace />;
  return <Navigate to="/" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/register/:role" element={<Register />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/dashboard/individual" element={<ProtectedRoute allowedRole="individual"><IndividualDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/banquet"    element={<ProtectedRoute allowedRole="banquet"><BanquetDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/public"     element={<ProtectedRoute allowedRole="public"><PublicDashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard"      element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
