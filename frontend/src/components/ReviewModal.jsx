import { useState } from 'react';
import { createPortal } from 'react-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiStar, HiX } from 'react-icons/hi';

export default function ReviewModal({ targetUser, game, onClose }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/reviews', {
        reviewedId: targetUser._id,
        rating,
        feedback,
        game
      });
      toast.success('Review submitted!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setLoading(false);
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-sky-600 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Rate {targetUser.name}</h2>
          <button onClick={onClose} className="text-sky-200 hover:text-white">
            <HiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-sm text-slate-500 mb-4 text-center">
            How was it playing <strong>{game}</strong> with them?
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-200'} hover:text-amber-300`}
              >
                <HiStar size={36} />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Feedback (Optional)</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="Great teammate, good comms..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={300}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
