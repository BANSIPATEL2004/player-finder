import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(result.data.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-600 rounded-2xl shadow-lg shadow-sky-200 mb-4">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Syne' }}>P</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Syne' }}>PlayerFinder</h1>
          <p className="text-slate-500 mt-1 text-sm">Find your perfect gaming teammates</p>
        </div>

        {/* Card */}
        <div className="card shadow-lg border-0">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 font-semibold hover:underline">Register</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Demo Admin: admin@pf.com / admin123
        </p>
      </div>
    </div>
  );
}
