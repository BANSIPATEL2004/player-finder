import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await register(form.name, form.email, form.password, form.username);
    if (result.success) {
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-600 rounded-2xl shadow-lg shadow-sky-200 mb-4">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Syne' }}>P</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Syne' }}>PlayerFinder</h1>
          <p className="text-slate-500 mt-1 text-sm">Join the gaming community</p>
        </div>

        <div className="card shadow-lg border-0">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Full Name *</label>
                <input type="text" placeholder="John Doe" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Username</label>
                <input type="text" placeholder="gamer_tag" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email Address *</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" autoComplete="email" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password *</label>
              <input type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field" autoComplete="new-password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
