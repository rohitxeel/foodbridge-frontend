import { useState, useEffect } from 'react';
import api from "../utils/api";
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';
const severityColors = { low: 'bg-yellow-100 text-yellow-700', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700' };
const statusColors = { open: 'bg-blue-100 text-blue-700', in_review: 'bg-purple-100 text-purple-700', resolved: 'bg-green-100 text-green-700' };

export default function PublicDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', description: '', location: '', photoUrl: '', severity: 'medium' });

  useEffect(() => { fetchReports(); }, []);
  const fetchReports = async () => {
    try { const { data } = await api.get(`${API_URL}/api/reports`); setReports(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSubmitting(true);
    try {
      const { data } = await api.post(`${API_URL}/api/reports`, form);
      setReports([data, ...reports]);
      setForm({ title: '', description: '', location: '', photoUrl: '', severity: 'medium' });
      setShowForm(false); setSuccess('Report submitted successfully! 🎉');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to submit report'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div><h1 className="text-4xl font-display font-bold text-gray-900">Hello, <span className="text-sky-600">{user?.name}</span></h1><p className="text-gray-500 mt-1">Report food wastage incidents in your community</p></div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">{showForm ? '✕ Cancel' : '+ New Report'}</button>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">{success}</div>}
      {showForm && (
        <div className="card mb-8 animate-slide-up border-l-4 border-sky-500">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">Report Food Wastage</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Report Title *</label><input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. Large food dump near park" required /></div>
            <div><label className="label">Severity *</label><select name="severity" value={form.severity} onChange={handleChange} className="input-field"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div className="sm:col-span-2"><label className="label">Description *</label><textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={3} required /></div>
            <div><label className="label">Location *</label><input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Address or landmark" required /></div>
            <div><label className="label">Photo URL</label><input type="url" name="photoUrl" value={form.photoUrl} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
            <div className="sm:col-span-2"><button type="submit" disabled={submitting} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Report'}</button></div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{ label: 'Total', value: reports.length, icon: '📋' }, { label: 'Open', value: reports.filter(r => r.status === 'open').length, icon: '🔵' }, { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, icon: '✅' }].map(s => (
          <div key={s.label} className="card text-center"><span className="text-2xl mb-1 block">{s.icon}</span><span className="text-3xl font-display font-bold text-gray-900 block">{s.value}</span><span className="text-xs text-gray-500">{s.label}</span></div>
        ))}
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-5">My Reports</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>
      : reports.length === 0 ? <div className="card text-center py-12 text-gray-400"><span className="text-5xl mb-3 block">📢</span><p>No reports yet. Be the first to report food wastage!</p></div>
      : <div className="space-y-4">{reports.map(r => (
          <div key={r._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap"><h3 className="font-semibold text-gray-900 text-lg">{r.title}</h3><span className={`status-badge ${severityColors[r.severity]}`}>{r.severity}</span><span className={`status-badge ${statusColors[r.status]}`}>{r.status.replace('_', ' ')}</span></div>
                <p className="text-sm text-gray-600 mb-1">{r.description}</p>
                <p className="text-sm text-gray-400">📍 {r.location}</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}</div>}
    </div>
  );
}