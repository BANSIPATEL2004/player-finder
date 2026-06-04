import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash } from 'react-icons/hi';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', icon: '' });

  const fetchGames = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/games');
      setGames(data.games);
    } catch (error) {
      toast.error('Failed to load games');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!newGame.name.trim()) return toast.error('Game name is required');
    try {
      const { data } = await API.post('/admin/games', newGame);
      toast.success(data.message);
      setGames([...games, data.game].sort((a, b) => a.name.localeCompare(b.name)));
      setNewGame({ name: '', icon: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add game');
    }
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      const { data } = await API.delete(`/admin/games/${id}`);
      toast.success(data.message);
      setGames(games.filter((g) => g._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete game');
    }
  };

  return (
    <Layout title="Manage Games">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Game Form */}
        <div className="card h-fit md:col-span-1 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Game</h2>
          <form onSubmit={handleAddGame} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Game Name</label>
              <input
                type="text"
                placeholder="e.g. Valorant"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Icon (Emoji/URL)</label>
              <input
                type="text"
                placeholder="e.g. 🎮"
                value={newGame.icon}
                onChange={(e) => setNewGame({ ...newGame, icon: e.target.value })}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <HiPlus size={18} /> Add Game
            </button>
          </form>
        </div>

        {/* Games List */}
        <div className="card md:col-span-2 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span>Available Games</span>
            <span className="badge bg-sky-100 text-sky-700">{games.length}</span>
          </h2>
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div></div>
          ) : games.length === 0 ? (
            <div className="text-center p-8 text-slate-500">No games found. Add some!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {games.map((game) => (
                <div key={game._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 h-8 flex items-center justify-center bg-white shadow-sm rounded-lg border border-slate-100">
                      {game.icon || '🎮'}
                    </span>
                    <span className="font-semibold text-slate-700 text-sm">{game.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGame(game._id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Game"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
