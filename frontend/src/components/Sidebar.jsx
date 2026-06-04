import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiHome, HiSearch, HiMail, HiUser, HiLogout,
  HiChartBar, HiUsers, HiViewGridAdd, HiUserGroup
} from 'react-icons/hi';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const playerLinks = [
    { to: '/dashboard', icon: <HiHome size={18} />, label: 'Dashboard' },
    { to: '/find-players', icon: <HiSearch size={18} />, label: 'Find Players' },
    { to: '/squads', icon: <HiUserGroup size={18} />, label: 'Squads' },
    { to: '/requests', icon: <HiMail size={18} />, label: 'Requests' },
    { to: '/profile', icon: <HiUser size={18} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <HiChartBar size={18} />, label: 'Dashboard' },
    { to: '/admin/users', icon: <HiUsers size={18} />, label: 'Manage Users' },
    { to: '/admin/games', icon: <HiViewGridAdd size={18} />, label: 'Manage Games' },
  ];

  const links = user?.role === 'admin' ? adminLinks : playerLinks;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col py-6 px-4 fixed top-0 left-0 z-40 shadow-sm transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 bg-sky-600 rounded-xl flex items-center justify-center shadow-md shadow-sky-200 dark:shadow-none">
          <span className="text-white font-bold text-lg" style={{ fontFamily: 'Syne' }}>P</span>
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-bold text-base leading-none" style={{ fontFamily: 'Syne' }}>PlayerFinder</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{user?.role === 'admin' ? 'Admin Panel' : 'Gaming Hub'}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3 transition-colors">
        <div className="w-9 h-9 bg-sky-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-sky-700 dark:text-sky-300 font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.username ? `@${user.username}` : user?.email}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Menu</p>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin' || to === '/dashboard'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="sidebar-link mt-4 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400"
      >
        <HiLogout size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
