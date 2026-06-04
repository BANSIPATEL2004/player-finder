import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('playerFinderUser') || 'null');
  });
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      newSocket.emit('join', user._id);
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user?._id]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('playerFinderUser', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, username) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password, username });
      setUser(data);
      localStorage.setItem('playerFinderUser', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('playerFinderUser');
  };

  const updateUserData = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('playerFinderUser', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserData, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
