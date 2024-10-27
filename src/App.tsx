import React, { useEffect } from 'react';
import { Ghost, Settings, Plus, Users } from 'lucide-react';
import { useStore } from './store';
import ChatRoom from './components/ChatRoom';
import UserSettings from './components/UserSettings';
import RoomList from './components/RoomList';

export default function App() {
  const { currentRoom, showSettings, currentUser, toggleSettings, addRoom, initializeBotRoom } = useStore();

  useEffect(() => {
    // Initialize bot room and show settings on first load if no user exists
    initializeBotRoom();
    if (!currentUser) {
      toggleSettings();
    }
  }, [currentUser, toggleSettings, initializeBotRoom]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 h-screen">
        <div className="flex gap-4 h-full">
          {/* Sidebar */}
          <div className="w-64 bg-purple-900/20 backdrop-blur-lg rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-8">
              <Ghost className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                NightShade
              </h1>
            </div>
            
            <div className="space-y-4">
              {currentUser && (
                <button 
                  onClick={() => addRoom({
                    name: `Room ${Math.floor(Math.random() * 1000)}`,
                    icon: '🌙',
                    messages: [],
                    users: [currentUser],
                  })}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Room
                </button>
              )}
              
              <RoomList />
              
              <button 
                onClick={toggleSettings}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-purple-900/20 backdrop-blur-lg rounded-lg border border-purple-500/20">
            {currentRoom && currentUser ? (
              <ChatRoom />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="w-16 h-16 text-purple-400 mb-4" />
                <h2 className="text-xl font-bold mb-2">Welcome to NightShade</h2>
                <p className="text-purple-300">
                  {!currentUser 
                    ? "Please set up your profile in settings"
                    : "Select a room to start chatting or create a new one"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSettings && <UserSettings />}
    </div>
  );
}