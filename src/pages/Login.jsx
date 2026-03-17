import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleConfig = {
  individual: { label: 'Individual User',        icon: '🧑‍🍳', color: 'text-primary-500', bg: 'bg-orange-50'  },
  banquet:    { label: 'Banquet / Marriage Hall', icon: '🏛️',  color: 'text-forest-600',  bg: 'bg-emerald-50' },
  public:     { label: 'Public Reporter',         icon: '📢',  color: 'text-sky-600',     bg: 'bg-sky-50'     },
  admin:      { label: 'NGO Admin',               icon: '🏢',  color: 'text-purple-600',  bg: 'bg-purple-50'  },
};

const roleRedirect = {
  individual: '/dashboard/individual',
  banquet:    '/dashboard/banquet',
  public:     '/dashboard/public',
  admin:      '/admin-dashboard',
};

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = roleConfig[role];
  if (!config) { navigate('/'); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const destination = roleRedirect[user.role];
      if (!destination) { setError('Unknown role. Please contact support.'); setLoading(false); return; }
      navigate(destination);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.bg} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>{config.icon}</div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Welcome Back</h1>
            <p className={`text-sm font-medium mt-1 ${config.color}`}>{config.label}</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {role !== 'admin' && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to={`/register/${role}`} className="text-primary-500 font-medium hover:underline">Register here</Link>
            </p>
          )}
          <p className="text-center text-sm text-gray-500 mt-2">
            <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
