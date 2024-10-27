import React from 'react';
import { User } from '../store';

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  isBot?: boolean;
  expiresAt: number;
}

interface Props {
  messages: Message[];
  currentUser: User | null;
}

export const MessageList: React.FC<Props> = ({ messages, currentUser }) => {
  const getTimeLeft = (expiresAt: number) => {
    const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg relative group ${
              msg.isBot
                ? 'bg-blue-500/20 text-blue-100'
                : msg.userId === currentUser?.id
                ? 'bg-purple-500/20 text-purple-100'
                : 'bg-gray-700/50 text-gray-100'
            }`}
          >
            <div className="break-words">{msg.content}</div>
            <span className="absolute -top-5 right-0 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
              {getTimeLeft(msg.expiresAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};