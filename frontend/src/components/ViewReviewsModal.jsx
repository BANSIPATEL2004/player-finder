import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import API from '../api/axios';
import { HiStar, HiX } from 'react-icons/hi';

export default function ViewReviewsModal({ targetUser, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ averageRating: 0, totalCount: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/reviews/${targetUser._id}`);
        setReviews(data.reviews);
        setStats({ averageRating: data.averageRating, totalCount: data.totalCount });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [targetUser._id]);

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold text-lg">{targetUser.name}'s Reviews</h2>
            {!loading && stats.totalCount > 0 && (
              <p className="text-xs text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                <HiStar /> {stats.averageRating} out of 5 ({stats.totalCount} reviews)
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <HiX size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-5 flex-1 bg-slate-50">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">⭐</span>
              <p className="mt-3 text-sm font-semibold text-slate-700">No reviews yet</p>
              <p className="text-xs text-slate-500 mt-1">This player hasn't received any reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                        {rev.reviewerId?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {rev.reviewerId?.name}
                        </p>
                        {rev.game && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            Played {rev.game}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'} size={14} />
                      ))}
                    </div>
                  </div>
                  {rev.feedback ? (
                    <p className="text-sm text-slate-600 mt-2 italic">"{rev.feedback}"</p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-2 italic">No written feedback provided.</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-3 text-right">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
