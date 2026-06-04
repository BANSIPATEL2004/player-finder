import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiBan, HiTrash, HiSearch, HiCheck } from 'react-icons/hi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchUsers = async (p = 1, s = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 8 });
      if (s) params.append('search', s);
      const { data } = await API.get(`/admin/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search);
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      await API.put(`/admin/users/${id}/block`);
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <Layout title="Manage Users">
      {/* Search */}
      <form onSubmit={handleSearch} className="card mb-5">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 flex-1">
            <HiSearch className="text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or username..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); fetchUsers(1, ''); }} className="btn-secondary text-sm">Clear</button>}
        </div>
      </form>

      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-slate-500">{total} users found</p>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">Player</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Games</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Joined</th>
              <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td colSpan={5} className="px-5 py-4">
                    <div className="h-8 bg-slate-100 rounded-lg animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No users found</td>
              </tr>
            ) : users.map(u => (
              <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700 font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {u.games?.slice(0, 2).map((g, i) => (
                      <span key={i} className="badge bg-slate-100 text-slate-600">{g.gameName}</span>
                    ))}
                    {u.games?.length > 2 && <span className="badge bg-slate-100 text-slate-400">+{u.games.length - 2}</span>}
                    {(!u.games || u.games.length === 0) && <span className="text-xs text-slate-300">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`badge ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => toggleBlock(u._id, u.isBlocked)}
                      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${u.isBlocked
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                    >
                      {u.isBlocked ? <><HiCheck size={13} /> Unblock</> : <><HiBan size={13} /> Block</>}
                    </button>
                    <button
                      onClick={() => deleteUser(u._id, u.name)}
                      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <HiTrash size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => { setPage(i + 1); fetchUsers(i + 1); }}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === i + 1 ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}
