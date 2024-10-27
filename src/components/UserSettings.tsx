import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { useStore } from '../store';
import { PRESET_AVATARS } from '../utils/avatars';

const UserSettings: React.FC = () => {
  const { currentUser, setCurrentUser, toggleSettings } = useStore();
  const [username, setUsername] = useState(currentUser?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0].url);

  const handleSave = () => {
    if (username.trim()) {
      setCurrentUser({
        id: currentUser?.id || crypto.randomUUID(),
        name: username,
        avatar: selectedAvatar,
      });
      toggleSettings();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-purple-900/30 backdrop-blur-lg rounded-lg p-6 w-[480px] border border-purple-500/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">User Settings</h2>
          <button onClick={toggleSettings} className="p-2 hover:bg-purple-500/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            {selectedAvatar ? (
              <img 
                src={selectedAvatar} 
                alt="Selected avatar" 
                className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-500/50"
              />
            ) : (
              <User className="w-24 h-24 p-4 rounded-full bg-purple-500/20" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-purple-900/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Choose Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.url}
                  onClick={() => setSelectedAvatar(avatar.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden group ${
                    selectedAvatar === avatar.url ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <img 
                    src={avatar.url} 
                    alt={avatar.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs text-white font-medium">{avatar.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className="w-full mt-6 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;