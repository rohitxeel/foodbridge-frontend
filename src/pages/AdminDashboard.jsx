import { useState, useEffect, useCallback } from 'react';
import api from "../utils/api";
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';
const AUTO_REFRESH_MS = 600000;

const donationStatusStyle = {
  available: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  accepted:  'bg-green-100  text-green-700  border border-green-200',
  rejected:  'bg-red-100    text-red-700    border border-red-200',
  claimed:   'bg-blue-100   text-blue-700   border border-blue-200',
  expired:   'bg-gray-100   text-gray-500   border border-gray-200',
};

const reportStatusStyle = {
  open:      'bg-yellow-100 text-yellow-700 border border-yellow-200',
  in_review: 'bg-blue-100   text-blue-700   border border-blue-200',
  resolved:  'bg-green-100  text-green-700  border border-green-200',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [reports, setReports]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [activeTab, setActiveTab] = useState('donations');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [donRes, repRes] = await Promise.all([
        api.get(`${API_URL}/api/admin/donations`),
        api.get(`${API_URL}/api/admin/reports`),
      ]);
      setDonations(donRes.data);
      setReports(repRes.data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Admin fetch error:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const updateDonation = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const { data } = await api.put(`${API_URL}/api/admin/donations/${id}`, { status });
      setDonations(prev => prev.map(d => d._id === id ? data : d));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const resolveReport = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const { data } = await api.put(`${API_URL}/api/admin/reports/${id}/resolve`);
      setReports(prev => prev.map(r => r._id === id ? data : r));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const stats = [
    { label: 'Total Donations',   value: donations.length,                                       icon: '📦', color: 'text-primary-500' },
    { label: 'Pending Donations', value: donations.filter(d => d.status === 'available').length,  icon: '⏳', color: 'text-yellow-600'  },
    { label: 'Accepted',          value: donations.filter(d => d.status === 'accepted').length,   icon: '✅', color: 'text-green-600'   },
    { label: 'Total Reports',     value: reports.length,                                          icon: '📋', color: 'text-sky-600'     },
    { label: 'Open Reports',      value: reports.filter(r => r.status === 'open').length,         icon: '🔴', color: 'text-red-500'     },
    { label: 'Resolved Reports',  value: reports.filter(r => r.status === 'resolved').length,     icon: '🟢', color: 'text-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">🏢</div>
            <h1 className="text-4xl font-display font-bold text-gray-900">NGO <span className="text-purple-600">Admin Panel</span></h1>
          </div>
          <p className="text-gray-500 mt-1">
            Logged in as <span className="font-medium text-gray-700">{user?.name}</span>
            {lastRefreshed && <span className="ml-3 text-xs text-gray-400">Last refreshed: {lastRefreshed.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={fetchAll} disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60">
          <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="card text-center py-5">
            <span className="text-2xl mb-1 block">{s.icon}</span>
            <span className={`text-3xl font-display font-bold block ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500 mt-1 leading-tight block">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('donations')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === 'donations' ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          📦 Donations ({donations.length})
        </button>
        <button onClick={() => setActiveTab('reports')}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === 'reports' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          📋 Reports ({reports.length})
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && activeTab === 'donations' && (
        <div className="space-y-4">
          {donations.length === 0
            ? <div className="card text-center py-12 text-gray-400"><span className="text-5xl mb-3 block">📦</span><p>No donations found.</p></div>
            : donations.map((d) => (
              <div key={d._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-lg">{d.foodName}</h3>
                      <span className={`status-badge ${donationStatusStyle[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">Qty: <span className="font-medium text-gray-700">{d.quantity}</span> · 📍 {d.address}</p>
                    {d.description && <p className="text-sm text-gray-400 italic">{d.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      Donor: <span className="font-medium text-gray-600">{d.user?.name}</span> · {d.user?.email} · Until: {new Date(d.availableUntil).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateDonation(d._id, 'accepted')} disabled={d.status === 'accepted' || actionLoading[d._id]}
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                      {actionLoading[d._id] ? '...' : '✓ Accept'}
                    </button>
                    <button onClick={() => updateDonation(d._id, 'rejected')} disabled={d.status === 'rejected' || actionLoading[d._id]}
                      className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                      {actionLoading[d._id] ? '...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {!loading && activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0
            ? <div className="card text-center py-12 text-gray-400"><span className="text-5xl mb-3 block">📋</span><p>No reports found.</p></div>
            : reports.map((r) => (
              <div key={r._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-lg">{r.title}</h3>
                      <span className={`status-badge ${r.severity === 'high' ? 'bg-red-100 text-red-700 border border-red-200' : r.severity === 'medium' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>{r.severity}</span>
                      <span className={`status-badge ${reportStatusStyle[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0.5">{r.description}</p>
                    <p className="text-sm text-gray-400">📍 {r.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Reporter: <span className="font-medium text-gray-600">{r.user?.name}</span> · {r.user?.email} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    {r.photoUrl && <a href={r.photoUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-500 hover:underline mt-1 inline-block">View Photo →</a>}
                  </div>
                  <button onClick={() => resolveReport(r._id)} disabled={r.status === 'resolved' || actionLoading[r._id]}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
                    {actionLoading[r._id] ? '...' : r.status === 'resolved' ? '✓ Resolved' : '✓ Resolve'}
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
