import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import ViewReviewsModal from './ViewReviewsModal';

const SKILL_COLORS = {
  Beginner: 'skill-badge-beginner',
  Intermediate: 'skill-badge-intermediate',
  Pro: 'skill-badge-pro',
};

const GAME_ICONS = {
  'BGMI': '🔫', 'Valorant': '⚡', 'Free Fire': '🔥',
  'Call of Duty': '💣', 'PUBG': '🎯', 'Minecraft': '⛏️',
  'GTA V': '🚗', 'FIFA': '⚽', 'Fortnite': '🏗️',
  'Apex Legends': '🦾', 'default': '🎮'
};

export default function PlayerCard({ player, onRequestSent }) {
  const [sending, setSending] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const handleSendRequest = async () => {
    if (!selectedGame) { toast.error('Select a game first'); return; }
    setSending(true);
    try {
      await API.post('/requests', { receiverId: player._id, game: selectedGame, message });
      toast.success('Request sent!');
      setShowForm(false);
      onRequestSent?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-700 font-bold text-lg flex-shrink-0">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm">{player.name}</h3>
            {player.username && <span className="text-slate-400 text-xs">@{player.username}</span>}
            {player.reviewCount > 0 && (
              <button 
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                ★ {player.averageRating?.toFixed(1)} <span className="text-slate-400 font-normal hover:text-slate-500">({player.reviewCount})</span>
              </button>
            )}
          </div>
          {player.bio && <p className="text-xs text-slate-500 mt-0.5 truncate">{player.bio}</p>}

          {/* Games */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {player.games?.map((g, i) => (
              <span key={i} className="flex items-center gap-1 bg-slate-100 text-slate-700 rounded-lg px-2 py-0.5 text-xs font-medium">
                <span>{GAME_ICONS[g.gameName] || GAME_ICONS.default}</span>
                {g.gameName}
                <span className={SKILL_COLORS[g.skillLevel] || 'badge bg-slate-100 text-slate-600 ml-1'}>
                  {g.skillLevel}
                </span>
              </span>
            ))}
            {(!player.games || player.games.length === 0) && (
              <span className="text-xs text-slate-400">No games added</span>
            )}
          </div>
        </div>
      </div>

      {/* Request Form Toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 btn-primary text-sm py-2"
          disabled={!player.games?.length}
        >
          Send Play Request
        </button>
      ) : (
        <div className="mt-4 space-y-2 p-3 bg-slate-50 rounded-xl">
          <select
            value={selectedGame}
            onChange={e => setSelectedGame(e.target.value)}
            className="input-field text-xs"
          >
            <option value="">Select a game...</option>
            {player.games?.map((g, i) => (
              <option key={i} value={g.gameName}>{g.gameName}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Add a message (optional)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="input-field text-xs"
          />
          <div className="flex gap-2">
            <button onClick={handleSendRequest} disabled={sending} className="btn-primary text-xs py-2 flex-1">
              {sending ? 'Sending...' : 'Send'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-xs py-2 flex-1">
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {showReviews && (
        <ViewReviewsModal targetUser={player} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
