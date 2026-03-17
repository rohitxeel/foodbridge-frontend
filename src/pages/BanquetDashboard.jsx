import { useState, useEffect } from 'react';
import api from "../utils/api";
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';
const pickupColors = { pending: 'bg-yellow-100 text-yellow-700', scheduled: 'bg-blue-100 text-blue-700', picked_up: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function BanquetDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ eventName: '', eventDate: '', numberOfPlates: '', foodItems: '', address: '', contactPhone: '', notes: '' });

  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => {
    try { const { data } = await api.get(`${API_URL}/api/banquet`); setEvents(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSubmitting(true);
    try {
      const { data } = await api.post(`${API_URL}/api/banquet`, form);
      setEvents([data, ...events]);
      setForm({ eventName: '', eventDate: '', numberOfPlates: '', foodItems: '', address: '', contactPhone: '', notes: '' });
      setShowForm(false); setSuccess('Event registered successfully! 🎉');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to register event'); }
    finally { setSubmitting(false); }
  };
  const handleStatusUpdate = async (id, pickupStatus) => {
    try { const { data } = await api.put(`${API_URL}/api/banquet/${id}/status`, { pickupStatus }); setEvents(events.map(e => e._id === id ? data : e)); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div><h1 className="text-4xl font-display font-bold text-gray-900"><span className="text-forest-600">{user?.hallName || user?.name}</span></h1><p className="text-gray-500 mt-1">Manage events and food donation schedules</p></div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }} className="btn-green">{showForm ? '✕ Cancel' : '+ New Event'}</button>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">{success}</div>}
      {showForm && (
        <div className="card mb-8 animate-slide-up border-l-4 border-forest-600">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-5">Register Donation Event</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div><label className="label">Event Name *</label><input type="text" name="eventName" value={form.eventName} onChange={handleChange} className="input-field" placeholder="e.g. Sharma Wedding" required /></div>
            <div><label className="label">Event Date & Time *</label><input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} className="input-field" required /></div>
            <div><label className="label">Estimated Leftover Plates *</label><input type="number" name="numberOfPlates" value={form.numberOfPlates} onChange={handleChange} className="input-field" placeholder="e.g. 200" min="1" required /></div>
            <div><label className="label">Contact Phone *</label><input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" required /></div>
            <div className="sm:col-span-2"><label className="label">Food Items *</label><input type="text" name="foodItems" value={form.foodItems} onChange={handleChange} className="input-field" placeholder="e.g. Rice, Biryani, Sweets" required /></div>
            <div className="sm:col-span-2"><label className="label">Venue Address *</label><input type="text" name="address" value={form.address} onChange={handleChange} className="input-field" required /></div>
            <div className="sm:col-span-2"><label className="label">Notes</label><textarea name="notes" value={form.notes} onChange={handleChange} className="input-field resize-none" rows={2} /></div>
            <div className="sm:col-span-2"><button type="submit" disabled={submitting} className="btn-green disabled:opacity-60">{submitting ? 'Registering...' : 'Register Event'}</button></div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[{ label: 'Total', value: events.length, icon: '🎪' }, { label: 'Pending', value: events.filter(e => e.pickupStatus === 'pending').length, icon: '⏳' }, { label: 'Scheduled', value: events.filter(e => e.pickupStatus === 'scheduled').length, icon: '📅' }, { label: 'Picked Up', value: events.filter(e => e.pickupStatus === 'picked_up').length, icon: '✅' }].map(s => (
          <div key={s.label} className="card text-center"><span className="text-2xl mb-1 block">{s.icon}</span><span className="text-3xl font-display font-bold text-gray-900 block">{s.value}</span><span className="text-xs text-gray-500">{s.label}</span></div>
        ))}
      </div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-5">Event History</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" /></div>
      : events.length === 0 ? <div className="card text-center py-12 text-gray-400"><span className="text-5xl mb-3 block">🏛️</span><p>No events registered yet.</p></div>
      : <div className="space-y-4">{events.map(ev => (
          <div key={ev._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap"><h3 className="font-semibold text-gray-900 text-lg">{ev.eventName}</h3><span className={`status-badge ${pickupColors[ev.pickupStatus]}`}>{ev.pickupStatus.replace('_', ' ')}</span></div>
                <p className="text-sm text-gray-500">🍽️ {ev.numberOfPlates} plates · {ev.foodItems}</p>
                <p className="text-sm text-gray-400 mt-1">📍 {ev.address} · 📞 {ev.contactPhone}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-gray-400">{new Date(ev.eventDate).toLocaleDateString()}</p>
                <select value={ev.pickupStatus} onChange={(e) => handleStatusUpdate(ev._id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none bg-white">
                  <option value="pending">Pending</option><option value="scheduled">Scheduled</option><option value="picked_up">Picked Up</option><option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}</div>}
    </div>
  );
}