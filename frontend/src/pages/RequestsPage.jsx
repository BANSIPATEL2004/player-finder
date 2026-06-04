import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HiCheck, HiX, HiChat, HiStar } from 'react-icons/hi';
import ChatBox from '../components/ChatBox';
import ReviewModal from '../components/ReviewModal';
import ViewReviewsModal from '../components/ViewReviewsModal';

const SKILL_COLORS = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Pro: 'bg-purple-100 text-purple-700',
};

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function RequestsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('incoming');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [viewReviewsUser, setViewReviewsUser] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let endpoint = tab === 'incoming' ? '/requests/incoming'
        : tab === 'sent' ? '/requests/sent'
        : '/requests/matches';
      const { data } = await API.get(endpoint);
      setRequests(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, [tab]);

  const handleRespond = async (id, status) => {
    try {
      await API.put(`/requests/${id}`, { status });
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const tabs = [
    { key: 'incoming', label: 'Incoming' },
    { key: 'sent', label: 'Sent' },
    { key: 'matches', label: 'My Matches' },
  ];

  return (
    <Layout title="Requests">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-semibold text-slate-600">No {tab} requests</p>
          <p className="text-sm text-slate-400 mt-1">
            {tab === 'incoming' ? 'No one has sent you a request yet' :
             tab === 'sent' ? `You haven't sent any requests` :
             'You have no matches yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const other = tab === 'incoming' ? req.senderId
              : tab === 'sent' ? req.receiverId
              : (req.senderId?._id === user?._id ? req.receiverId : req.senderId);

            return (
              <div key={req._id} className="card flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-700 font-bold flex-shrink-0">
                  {other?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800 text-sm">{other?.name}</p>
                    {other?.username && <span className="text-slate-400 text-xs">@{other.username}</span>}
                    {other?.reviewCount > 0 && (
                      <button 
                        onClick={() => setViewReviewsUser(other)}
                        className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        ★ {other.averageRating?.toFixed(1)} <span className="text-slate-400 font-normal hover:text-slate-500">({other.reviewCount})</span>
                      </button>
                    )}
                    <span className="badge bg-sky-100 text-sky-700">🎮 {req.game}</span>
                    {tab !== 'incoming' && (
                      <span className={`badge ${STATUS_BADGE[req.status]}`}>{req.status}</span>
                    )}
                  </div>
                  {req.message && tab !== 'matches' && <p className="text-xs text-slate-500 mt-0.5 italic">"{req.message}"</p>}
                  {tab === 'matches' && req.lastMessage && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded uppercase">Last Message</span>
                      <p className="text-xs text-slate-600 truncate max-w-[200px]">
                        {req.lastMessage.senderId.toString() === user._id ? 'You: ' : ''}{req.lastMessage.text}
                      </p>
                    </div>
                  )}
                  {tab === 'matches' && !req.lastMessage && (
                    <p className="text-xs text-slate-400 mt-1 italic">No messages yet. Say hi!</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {other?.games?.slice(0, 3).map((g, i) => (
                      <span key={i} className={`badge text-xs ${SKILL_COLORS[g.skillLevel]}`}>
                        {g.gameName} · {g.skillLevel}
                      </span>
                    ))}
                  </div>
                </div>
                {tab === 'incoming' && req.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleRespond(req._id, 'accepted')} className="btn-success flex items-center gap-1 text-xs py-2 px-3">
                      <HiCheck size={14} /> Accept
                    </button>
                    <button onClick={() => handleRespond(req._id, 'rejected')} className="btn-danger flex items-center gap-1 text-xs py-2 px-3">
                      <HiX size={14} /> Reject
                    </button>
                  </div>
                )}
                {tab === 'matches' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setReviewData({ target: other, game: req.game })} className="btn-secondary flex items-center gap-1 text-xs py-2 px-3">
                      <HiStar size={14} className="text-amber-400" /> Rate
                    </button>
                    <button onClick={() => setChatUser(other)} className="btn-primary flex items-center gap-1 text-xs py-2 px-3">
                      <HiChat size={14} /> Chat
                    </button>
                    <span className="badge bg-emerald-100 text-emerald-700 text-xs flex items-center">✓ Matched</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {chatUser && <ChatBox receiver={chatUser} onClose={() => setChatUser(null)} />}
      {reviewData && (
        <ReviewModal
          targetUser={reviewData.target}
          game={reviewData.game}
          onClose={() => {
            setReviewData(null);
            fetchRequests(); // Refresh to show new rating
          }}
        />
      )}
      {viewReviewsUser && (
        <ViewReviewsModal targetUser={viewReviewsUser} onClose={() => setViewReviewsUser(null)} />
      )}
    </Layout>
  );
}
