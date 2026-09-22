import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, UserCheck, HardHat } from 'lucide-react';
import { api } from '../../api/client';
import { useProject } from '../../context/ProjectContext';

interface ContextualChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'PROJECT' | 'MILESTONE' | 'ISSUE' | 'CHANGE_REQUEST' | 'PAYMENT';
  entityId: string;
  title: string;
}

export const ContextualChatModal: React.FC<ContextualChatModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  title
}) => {
  const { currentUser } = useAuth();
  const { activeProjectId } = useProject();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    api.getMessages(entityType, entityId)
      .then(setMessages)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load this conversation.'));
  }, [isOpen, entityType, entityId, currentUser.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const newMsg = await api.sendMessage({ projectId: activeProjectId, entityType, entityId, content: input.trim() });
      setMessages(prev => [...prev, newMsg]);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-center justify-between text-slate-500 font-medium">
          <span>Context: <b>{entityType}</b> (`{entityId}`)</span>
          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">Encrypted Contextual Thread</span>
        </div>

        {/* Message Stream */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
          {messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-700">{m.senderName}</span>
                  <span>({m.senderRole})</span>
                  <span>•</span>
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-3 rounded-2xl text-xs max-w-xs ${
                  isMe ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Input */}
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type contextual response..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shrink-0 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      </div>
    </Modal>
  );
};
