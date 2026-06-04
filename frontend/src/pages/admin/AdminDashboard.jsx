import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axios';
import { HiUsers, HiCheckCircle, HiClock, HiBan } from 'react-icons/hi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard').then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = data ? [
    { label: 'Total Players', value: data.stats.totalUsers, icon: <HiUsers size={22} />, color: 'bg-sky-100 text-sky-700', border: 'border-sky-200' },
    { label: 'Total Matches', value: data.stats.totalMatches, icon: <HiCheckCircle size={22} />, color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
    { label: 'Pending Requests', value: data.stats.pendingRequests, icon: <HiClock size={22} />, color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
    { label: 'Blocked Users', value: data.stats.blockedUsers, icon: <HiBan size={22} />, color: 'bg-red-100 text-red-600', border: 'border-red-200' },
  ] : [];

  return (
    <Layout title="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-slate-50"></div>) :
          statCards.map(({ label, value, icon, color, border }) => (
            <div key={label} className={`card border-2 ${border}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} mb-3`}>{icon}</div>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">Recent Registrations</h3>
          {loading ? <div className="animate-pulse space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>)}</div> :
            <div className="space-y-2">
              {data?.recentUsers?.map(u => (
                <div key={u._id} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700 font-bold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Available Games */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">Available Games</h3>
          {loading ? <div className="animate-pulse h-40 bg-slate-100 rounded-xl"></div> :
            <div className="flex flex-wrap gap-2">
              {data?.availableGames?.map(g => (
                <span key={g} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-sky-50 hover:text-sky-700 transition-colors">
                  🎮 {g}
                </span>
              ))}
            </div>
          }
        </div>
      </div>
    </Layout>
  );
}
