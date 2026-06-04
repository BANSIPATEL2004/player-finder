import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { HiSearch, HiMail, HiUsers, HiCheckCircle } from 'react-icons/hi';



export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ incoming: 0, matches: 0, sent: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomingRes, matchesRes, sentRes, gamesRes] = await Promise.all([
          API.get('/requests/incoming'),
          API.get('/requests/matches'),
          API.get('/requests/sent'),
          API.get('/games')
        ]);
        setStats({
          incoming: incomingRes.data.filter(r => r.status === 'pending').length,
          matches: matchesRes.data.length,
          sent: sentRes.data.filter(r => r.status === 'pending').length,
        });
        setRecentMatches(matchesRes.data.slice(0, 3));
        setGamesList(gamesRes.data.games);
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Pending Requests', value: stats.incoming, icon: <HiMail size={20} />, color: 'text-amber-600 bg-amber-50', link: '/requests' },
    { label: 'My Matches', value: stats.matches, icon: <HiCheckCircle size={20} />, color: 'text-emerald-600 bg-emerald-50', link: '/requests' },
    { label: 'Sent Requests', value: stats.sent, icon: <HiUsers size={20} />, color: 'text-sky-600 bg-sky-50', link: '/requests' },
  ];

  return (
    <Layout>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-sky-200">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>
          Hey, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-sky-100 mt-1 text-sm">Ready to find your gaming teammates today?</p>
        <Link to="/find-players" className="inline-flex items-center gap-2 mt-4 bg-white text-sky-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-sky-50 transition-colors">
          <HiSearch size={16} /> Find Players
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, value, icon, color, link }) => (
          <Link key={label} to={link} className="card hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>{icon}</div>
            <div className="text-2xl font-bold text-slate-900">{loading ? '—' : value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* My Games */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">My Games</h3>
          {user?.games?.length > 0 ? (
            <div className="space-y-2">
              {user.games.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span>{gamesList.find(gl => gl.name === g.gameName)?.icon || '🎮'}</span>
                    {g.gameName}
                  </span>
                  <span className={`badge ${g.skillLevel === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : g.skillLevel === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                    {g.skillLevel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No games added yet</p>
              <Link to="/profile" className="btn-primary text-xs mt-3 inline-block">Add Games</Link>
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4 text-sm">Recent Matches</h3>
          {recentMatches.length > 0 ? (
            <div className="space-y-2">
              {recentMatches.map((m) => {
                const other = m.senderId?._id === user?._id ? m.receiverId : m.senderId;
                return (
                  <div key={m._id} className="flex items-center gap-3 p-2 bg-emerald-50 rounded-xl">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {other?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{other?.name}</p>
                      <p className="text-xs text-slate-400">{m.game}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400">No matches yet</p>
              <p className="text-xs text-slate-400 mt-1">Start finding players!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
