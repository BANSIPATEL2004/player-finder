import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { HiX, HiPaperAirplane } from 'react-icons/hi';

export default function ChatBox({ receiver, onClose }) {
  const { user, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await API.get(`/messages/${receiver._id}`);
        setMessages(data);
      } catch (e) {}
    };
    fetchMessages();
  }, [receiver._id]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (message) => {
      if (message.senderId === receiver._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, [socket, receiver._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = { receiverId: receiver._id, text: newMessage };
    
    try {
      const { data } = await API.post('/messages', msgData);
      setMessages([...messages, data]);
      setNewMessage('');
      socket?.emit('sendMessage', data);
    } catch (err) {}
  };

  return createPortal(
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-t-xl rounded-bl-xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-sky-600 text-white p-3 flex justify-between items-center">
        <div className="font-semibold text-sm flex items-center gap-2">
          <div className="w-6 h-6 bg-white text-sky-600 rounded-full flex items-center justify-center text-xs">
            {receiver.name.charAt(0).toUpperCase()}
          </div>
          {receiver.name}
        </div>
        <button onClick={onClose} className="text-sky-200 hover:text-white">
          <HiX size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-3 bg-slate-50">
        {messages.map((m, i) => {
          const isMe = m.senderId === user._id;
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-2 rounded-xl text-sm ${isMe ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-2 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm outline-none px-2 py-1"
        />
        <button type="submit" className="text-sky-600 p-2 hover:bg-sky-50 rounded-lg">
          <HiPaperAirplane className="rotate-90" size={18} />
        </button>
      </form>
    </div>,
    document.body
  );
}
