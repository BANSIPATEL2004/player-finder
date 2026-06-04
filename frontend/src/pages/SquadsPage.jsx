import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiPlus, HiUsers, HiUserAdd } from 'react-icons/hi';

export default function SquadsPage() {
  const { user } = useAuth();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamesList, setGamesList] = useState([]);
  
  const [showCreate, setShowCreate] = useState(false);
  const [newSquad, setNewSquad] = useState({ name: '', game: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await API.get('/games');
        setGamesList(data.games);
      } catch (error) {}
    };
    fetchGames();
  }, []);

  const fetchSquads = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/squads');
      setSquads(data);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => { fetchSquads(); }, []);

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/squads', newSquad);
      toast.success('Squad created successfully!');
      setShowCreate(false);
      setNewSquad({ name: '', game: '' });
      fetchSquads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create squad');
    }
    setCreating(false);
  };

  const handleJoinSquad = async (id) => {
    try {
      await API.put(`/squads/${id}/join`);
      toast.success('Joined squad!');
      fetchSquads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    }
  };

  return (
    <Layout title="Squads & Clans">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500 text-sm">Find a team or build your own squad.</p>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-1 text-sm py-2 px-4">
          <HiPlus /> Create Squad
        </button>
      </div>

      {showCreate && (
        <div className="card mb-6 bg-sky-50 border-sky-100">
          <h3 className="font-bold text-sky-900 mb-3 text-sm">Create New Squad</h3>
          <form onSubmit={handleCreateSquad} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Squad Name</label>
              <input type="text" required value={newSquad.name} onChange={e => setNewSquad({ ...newSquad, name: e.target.value })} className="input-field py-2 text-sm" placeholder="e.g. Phoenix Elite" />
            </div>
            <div className="w-1/3">
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Game</label>
              <select required value={newSquad.game} onChange={e => setNewSquad({ ...newSquad, game: e.target.value })} className="input-field py-2 text-sm">
                <option value="">Select...</option>
                {gamesList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <button type="submit" disabled={creating} className="btn-primary py-2 px-4 text-sm whitespace-nowrap">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-slate-100"></div>)}
        </div>
      ) : squads.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">🛡️</div>
          <p className="font-semibold text-slate-600">No squads found</p>
          <p className="text-sm text-slate-400 mt-1">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {squads.map(squad => {
            const isMember = squad.members.some(m => m._id === user._id);
            const isFull = squad.members.length >= squad.maxPlayers;

            return (
              <div key={squad._id} className={`card border-l-4 ${isMember ? 'border-l-sky-500' : 'border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      {squad.name}
                      {isMember && <span className="badge bg-sky-100 text-sky-700 text-[10px]">Your Squad</span>}
                    </h3>
                    <span className="badge bg-slate-100 text-slate-600 mt-1">🎮 {squad.game}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${isFull ? 'text-red-500' : 'text-emerald-500'}`}>
                      {squad.members.length} / {squad.maxPlayers}
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase">Members</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-sm">
                  <span className="text-xs text-slate-500 font-medium w-12">Leader:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {squad.leaderId.name.charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium">{squad.leaderId.name}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {squad.members.map(m => (
                      <div key={m._id} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600" title={m.name}>
                        {m.name.charAt(0)}
                      </div>
                    ))}
                  </div>

                  {!isMember && (
                    <button 
                      onClick={() => handleJoinSquad(squad._id)}
                      disabled={isFull}
                      className={`flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg font-semibold transition-colors ${
                        isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {isFull ? 'Full' : <><HiUserAdd /> Join Squad</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
