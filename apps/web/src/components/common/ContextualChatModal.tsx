import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, UserCheck, HardHat } from 'lucide-react';

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
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      senderName: 'Vikram Singh',
      senderRole: 'BUILDER',
      content: 'Hi Rajesh, the Italian marble rate includes polishing and seal coating. Let me know if you approve.',
      timestamp: '15:30'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');
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
            const isMe = m.senderName === currentUser.fullName;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-700">{m.senderName}</span>
                  <span>({m.senderRole})</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
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
      </div>
    </Modal>
  );
};
