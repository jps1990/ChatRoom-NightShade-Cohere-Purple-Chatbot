import React, { forwardRef } from 'react';
import { Send } from 'lucide-react';

interface Props {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

export const MessageInput = forwardRef<HTMLInputElement, Props>(
  ({ message, setMessage, onSend }, ref) => {
    return (
      <div className="p-4 border-t border-purple-500/20">
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
            className="flex-1 bg-purple-900/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="Type a message..."
          />
          <button
            onClick={onSend}
            disabled={!message.trim()}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';