import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit, Users } from 'lucide-react';
import { useStore } from '../store';
import { generateJoke } from '../utils/cohere';
import { RoomCustomization } from './RoomCustomization';
import { BotMessage } from './BotMessage';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

const ChatRoom: React.FC = () => {
  const { currentRoom, currentUser, addMessage, rooms } = useStore();
  const [message, setMessage] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [isGeneratingJoke, setIsGeneratingJoke] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const botTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  const room = rooms.find(r => r.id === currentRoom);
  const [nextBotMessage, setNextBotMessage] = useState(Math.floor(Math.random() * 3) + 1);
  const [messageCounter, setMessageCounter] = useState(0);

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Petit délai pour laisser le DOM se mettre à jour
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end'
        });
      }
    }, 100);
  }, []);

  // Scroll quand les messages changent ou pendant le streaming
  useEffect(() => {
    scrollToBottom();
  }, [room?.messages, scrollToBottom, streamedResponse]);

  // Scroll quand le bot commence à générer une réponse
  useEffect(() => {
    if (isGeneratingJoke) {
      scrollToBottom();
    }
  }, [isGeneratingJoke, scrollToBottom]);

  useEffect(() => {
    messageInputRef.current?.focus();
    // Scroll initial sans animation
    scrollToBottom(false);
  }, [currentRoom, scrollToBottom]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      useStore.getState().deleteExpiredMessages();
    }, 60000);
    return () => {
      clearInterval(cleanup);
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const generateBotResponse = useCallback(async (userMessage: string) => {
    if (!currentRoom || !room || isGeneratingJoke) return;
    
    setIsGeneratingJoke(true);
    setStreamedResponse('');
    scrollToBottom();
    
    try {
      const response = await generateJoke(userMessage, (text) => {
        setStreamedResponse(text);
        scrollToBottom();
      });
      
      if (response && currentRoom) {
        await addMessage(currentRoom, {
          userId: 'bot',
          content: response,
          isBot: true,
        });
      }
    } catch (error) {
      console.error('Error generating bot response:', error);
    } finally {
      setIsGeneratingJoke(false);
      setStreamedResponse('');
      const nextDelay = Math.floor(Math.random() * 3) + 1;
      setNextBotMessage(messageCounter + nextDelay);
      scrollToBottom();
    }
  }, [currentRoom, room, messageCounter, addMessage, isGeneratingJoke, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !currentRoom || !currentUser) return;

    const currentMessage = message.trim();
    setMessage('');

    try {
      await addMessage(currentRoom, {
        userId: currentUser.id,
        content: currentMessage,
      });
      scrollToBottom();

      if (room?.id === 'bot-room') {
        botTimeoutRef.current = setTimeout(() => {
          generateBotResponse(currentMessage);
        }, 500);
      } else {
        const newCounter = messageCounter + 1;
        setMessageCounter(newCounter);
        if (newCounter === nextBotMessage) {
          botTimeoutRef.current = setTimeout(() => {
            generateBotResponse(currentMessage);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(currentMessage);
    }
  }, [message, currentRoom, currentUser, messageCounter, nextBotMessage, addMessage, generateBotResponse, room?.id, scrollToBottom]);

  if (!room) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.icon}</span>
          <h2 className="text-xl font-bold">{room.name}</h2>
          {!room.isPermanent && (
            <button 
              onClick={() => setShowCustomization(true)} 
              className="p-2 rounded-full hover:bg-purple-500/20"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30">
          <Users className="w-4 h-4" />
          <span>{room.users.length} Users</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList messages={room.messages} currentUser={currentUser} />
        
        {isGeneratingJoke && streamedResponse && (
          <div className="flex justify-start px-4 pb-4">
            <div className="max-w-[70%] p-3 rounded-lg bg-blue-500/20 text-blue-100">
              <div className="break-words">{streamedResponse}</div>
            </div>
          </div>
        )}
        
        <BotMessage isGenerating={isGeneratingJoke && !streamedResponse} />
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <MessageInput
        ref={messageInputRef}
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
      />

      {showCustomization && (
        <RoomCustomization
          room={room}
          onClose={() => setShowCustomization(false)}
        />
      )}
    </div>
  );
};

export default ChatRoom;