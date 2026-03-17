import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  const roleLabel = { individual: 'Individual User', banquet: 'Banquet Hall', public: 'Public Reporter' };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-forest-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg">🌉</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">Food<span className="text-primary-500">Bridge</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-800">{user.name || user.hallName}</span>
                  <span className="text-xs text-primary-500 font-medium">{roleLabel[user.role]}</span>
                </div>
                <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-sm">Logout</button>
              </>
            ) : (
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">Get Started →</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}