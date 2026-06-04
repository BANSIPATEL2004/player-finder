import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PlayerCard from '../components/PlayerCard';
import API from '../api/axios';
import { HiSearch, HiFilter } from 'react-icons/hi';

const SKILLS = ['Beginner', 'Intermediate', 'Pro'];

export default function FindPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [gamesList, setGamesList] = useState([]);

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

  const fetchPlayers = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 8 });
      if (game) params.append('game', game);
      if (skillLevel) params.append('skillLevel', skillLevel);
      const { data } = await API.get(`/users/search?${params}`);
      setPlayers(data.players);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchPlayers(1); setPage(1); }, [game, skillLevel]);

  return (
    <Layout title="Find Players">
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-2 flex-1 min-w-48">
            <HiSearch className="text-slate-400 flex-shrink-0" size={18} />
            <select value={game} onChange={e => setGame(e.target.value)} className="input-field text-sm">
              <option value="">All Games</option>
              {gamesList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
          <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)} className="input-field text-sm max-w-48">
            <option value="">All Skill Levels</option>
            {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(game || skillLevel) && (
            <button onClick={() => { setGame(''); setSkillLevel(''); }} className="btn-secondary text-sm py-2 px-3">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {loading ? 'Searching...' : `${total} player${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-2 bg-slate-100 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : players.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            {players.map(p => (
              <PlayerCard key={p._id} player={p} onRequestSent={() => {}} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); fetchPlayers(i + 1); }}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === i + 1 ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 card">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-slate-700 text-lg">No players found</h3>
          <p className="text-slate-400 text-sm mt-1">Try different filters or check back later</p>
        </div>
      )}
    </Layout>
  );
}
