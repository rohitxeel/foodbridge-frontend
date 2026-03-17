import { useState, useEffect } from 'react';
import api from "../utils/api";
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';
const statusColors = { available: 'bg-green-100 text-green-700', claimed: 'bg-blue-100 text-blue-700', expired: 'bg-gray-100 text-gray-600' };

export default function IndividualDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ foodName: '', quantity: '', description: '', address: '', availableUntil: '', photoUrl: '' });

  useEffect(() => { fetchDonations(); }, []);
  const fetchDonations = async () => {
    try { const { data } = await api.get(`${API_URL}/api/donations`); setDonations(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSubmitting(true);
    try {
      const { data } = await api.post(`${API_URL}/api/donations`, form);
      setDonations([data, ...donations]);
      setForm({ foodName: '', quantity: '', description: '', address: '', availableUntil: '', photoUrl: '' });
      setShowForm(false); setSuccess('Donation listed successfully! 🎉');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to submit donation'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div><h1 className="text-4xl font-display font-bold text-gray-900">Welcome, <span className="text-primary-500">{user?.name}</span></h1><p className="text-gray-500 mt-1">Manage your food donations and help reduce waste</p></div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }} className="btn-primary">{showForm ? '✕ Cancel' : '+ Donate Food'}</button>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">{success}</div>}
      {showForm && (
        <div className="card mb-8 animate-slide-up border-l-4 border-primary-400">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">New Food Donation</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Food Name *</label><input type="text" name="foodName" value={form.foodName} onChange={handleChange} className="input-field" placeholder="e.g. Rice and Dal" required /></div>
            <div><label className="label">Quantity *</label><input type="text" name="quantity" value={form.quantity} onChange={handleChange} className="input-field" placeholder="e.g. 5 kg" required /></div>
            <div className="sm:col-span-2"><label className="label">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={2} /></div>
            <div><label className="label">Pickup Address *</label><input type="text" name="address" value={form.address} onChange={handleChange} className="input-field" required /></div>
            <div><label className="label">Available Until *</label><input type="datetime-local" name="availableUntil" value={form.availableUntil} onChange={handleChange} className="input-field" required /></div>
            <div className="sm:col-span-2"><label className="label">Photo URL</label><input type="url" name="photoUrl" value={form.photoUrl} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
            <div className="sm:col-span-2"><button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Donation'}</button></div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{ label: 'Total', value: donations.length, icon: '📦' }, { label: 'Available', value: donations.filter(d => d.status === 'available').length, icon: '✅' }, { label: 'Claimed', value: donations.filter(d => d.status === 'claimed').length, icon: '🤝' }].map(s => (
          <div key={s.label} className="card text-center"><span className="text-2xl mb-1 block">{s.icon}</span><span className="text-3xl font-display font-bold text-gray-900 block">{s.value}</span><span className="text-xs text-gray-500">{s.label}</span></div>
        ))}
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-5">Donation History</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>
      : donations.length === 0 ? <div className="card text-center py-12 text-gray-400"><span className="text-5xl mb-3 block">🍱</span><p>No donations yet. Start by donating surplus food!</p></div>
      : <div className="space-y-4">{donations.map(d => (
          <div key={d._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div><div className="flex items-center gap-3 mb-1"><h3 className="font-semibold text-gray-900 text-lg">{d.foodName}</h3><span className={`status-badge ${statusColors[d.status]}`}>{d.status}</span></div><p className="text-sm text-gray-500">Qty: {d.quantity} · {d.address}</p></div>
              <div className="text-right text-xs text-gray-400"><p>Until {new Date(d.availableUntil).toLocaleDateString()}</p><p>{new Date(d.createdAt).toLocaleDateString()}</p></div>
            </div>
          </div>
        ))}</div>}
    </div>
  );
}