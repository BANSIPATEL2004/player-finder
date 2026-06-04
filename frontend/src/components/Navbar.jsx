import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiBell, HiMoon, HiSun } from "react-icons/hi";
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, socket } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(0);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNotification = (data) => {
      setNotifications((prev) => prev + 1);
      
      if (data.type === 'new_message') {
        toast(`New message from ${data.senderName}`, { icon: '💬' });
      } else if (data.type === 'new_request') {
        toast(`New play request from ${data.request?.senderId?.name}!`, { icon: '🎮' });
      } else if (data.type === 'request_responded') {
        toast(`Your request was ${data.request?.status}`, { icon: '🔔' });
      }
    };

    socket.on('receiveNotification', handleNotification);
    return () => socket.off('receiveNotification', handleNotification);
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = user?.role === "admin"
    ? [{ to: "/admin", label: "Admin Dashboard" }]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/find-players", label: "Find Players" },
        { to: "/requests", label: "Requests" },
        { to: "/profile", label: "Profile" },
      ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white">PlayerFinder</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? <HiSun size={22} /> : <HiMoon size={22} />}
            </button>

            {user && user.role !== "admin" && (
              <Link to="/requests" onClick={() => setNotifications(0)} className="relative text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                <HiBell size={24} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </Link>
            )}

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
