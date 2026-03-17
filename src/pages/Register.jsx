import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleConfig = {
  individual: { label: 'Individual User', icon: '🧑‍🍳', color: 'text-primary-500', bg: 'bg-orange-50' },
  banquet: { label: 'Banquet / Marriage Hall', icon: '🏛️', color: 'text-forest-600', bg: 'bg-emerald-50' },
  public: { label: 'Public Reporter', icon: '📢', color: 'text-sky-600', bg: 'bg-sky-50' },
};

export default function Register() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', hallName: '', ownerName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const config = roleConfig[role];
  if (!config) { navigate('/'); return null; }
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const payload = { name: role === 'banquet' ? form.ownerName : form.name, email: form.email, phone: form.phone, password: form.password, role };
      if (role === 'banquet') { payload.hallName = form.hallName; payload.ownerName = form.ownerName; }
      await register(payload);
      navigate(`/dashboard/${role}`);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${config.bg} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>{config.icon}</div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Create Account</h1>
            <p className={`text-sm font-medium mt-1 ${config.color}`}>{config.label}</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'banquet' ? (<>
              <div><label className="label">Hall / Venue Name</label><input type="text" name="hallName" value={form.hallName} onChange={handleChange} className="input-field" placeholder="Grand Palace Banquet Hall" required /></div>
              <div><label className="label">Owner / Manager Name</label><input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} className="input-field" placeholder="Your full name" required /></div>
            </>) : (
              <div><label className="label">Full Name</label><input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" required /></div>
            )}
            <div><label className="label">Email Address</label><input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required /></div>
            <div><label className="label">Phone Number</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" required /></div>
            <div><label className="label">Password</label><input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Min. 6 characters" required /></div>
            <div><label className="label">Confirm Password</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Re-enter password" required /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to={`/login/${role}`} className="text-primary-500 font-medium hover:underline">Sign in</Link></p>
          <p className="text-center text-sm text-gray-500 mt-2"><Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}