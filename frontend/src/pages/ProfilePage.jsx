import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash } from 'react-icons/hi';
import ViewReviewsModal from '../components/ViewReviewsModal';

const SKILLS = ['Beginner', 'Intermediate', 'Pro'];

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    games: user?.games || [],
  });
  const [saving, setSaving] = useState(false);
  const [newGame, setNewGame] = useState({ gameName: '', skillLevel: 'Beginner' });
  const [gamesList, setGamesList] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await API.get('/games');
        setGamesList(data.games);
      } catch (error) {
        console.error('Failed to fetch games', error);
      }
    };
    fetchGames();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/users/profile', form);
      updateUserData(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const addGame = () => {
    if (!newGame.gameName) { toast.error('Select a game'); return; }
    if (form.games.find(g => g.gameName === newGame.gameName)) { toast.error('Game already added'); return; }
    setForm({ ...form, games: [...form.games, { ...newGame }] });
    setNewGame({ gameName: '', skillLevel: 'Beginner' });
  };

  const removeGame = (index) => {
    const updated = form.games.filter((_, i) => i !== index);
    setForm({ ...form, games: updated });
  };

  const SKILL_COLORS = {
    Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    Pro: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <Layout title="My Profile">
      <div className="grid grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="col-span-1">
          <div className="card text-center sticky top-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-3xl shadow-lg shadow-sky-200">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h3 className="font-bold text-slate-900 mt-4 text-lg">{user?.name}</h3>
            {user?.username && <p className="text-slate-400 text-sm">@{user.username}</p>}
            
            {user?.reviewCount > 0 && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <button 
                  onClick={() => setShowReviews(true)}
                  className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  ★ {user.averageRating?.toFixed(1)} <span className="text-slate-400 text-xs font-medium hover:text-slate-500">({user.reviewCount} reviews)</span>
                </button>
              </div>
            )}

            <p className="text-slate-500 text-xs mt-3">{user?.email}</p>
            {user?.bio && <p className="text-slate-600 text-sm mt-3 italic">"{user.bio}"</p>}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Games Played</p>
              <p className="text-2xl font-bold text-sky-600 mt-1">{user?.games?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Username</label>
                  <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field" placeholder="@username" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Bio <span className="text-slate-400">(max 200 chars)</span></label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  maxLength={200}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Games */}
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-4">My Games</h3>

            {form.games.length > 0 && (
              <div className="space-y-2 mb-4">
                {form.games.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{gamesList.find(gl => gl.name === g.gameName)?.icon || '🎮'}</span>
                      <span className="font-medium text-slate-800 text-sm">{g.gameName}</span>
                      <span className={`badge border ${SKILL_COLORS[g.skillLevel]}`}>{g.skillLevel}</span>
                    </div>
                    <button onClick={() => removeGame(i)} className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors">
                      <HiTrash size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Game */}
            <div className="flex gap-2 p-3 bg-sky-50 rounded-xl">
              <select value={newGame.gameName} onChange={e => setNewGame({ ...newGame, gameName: e.target.value })} className="input-field text-sm flex-1">
                <option value="">Select game...</option>
                {gamesList.filter(g => !form.games.find(fg => fg.gameName === g.name)).map(g => (
                  <option key={g._id} value={g.name}>{g.name}</option>
                ))}
              </select>
              <select value={newGame.skillLevel} onChange={e => setNewGame({ ...newGame, skillLevel: e.target.value })} className="input-field text-sm w-36">
                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={addGame} className="btn-primary flex items-center gap-1 text-sm py-2 px-3 flex-shrink-0">
                <HiPlus size={16} /> Add
              </button>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
      
      {showReviews && (
        <ViewReviewsModal targetUser={user} onClose={() => setShowReviews(false)} />
      )}
    </Layout>
  );
}
